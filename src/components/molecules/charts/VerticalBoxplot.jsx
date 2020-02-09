import React, { useRef, useEffect } from "react"
import { select } from "d3-selection"
import "d3-transition"

import { FlexContainer, ChartSvg, ChartArea } from "../../atoms"
import { useDimensions, usePrevious } from "../../../hooks"
import { transition, colors } from "../../../themes/theme"
import { useInitUpdate } from "../../../hooks"
import { scaleLinear } from "d3-scale"
import { easeCubicInOut } from "d3-ease"

const { mdNum } = transition
const { grayDarkest, grayLighter } = colors

export default function VerticalBoxPlot({ data, domain, margin, isFiltered }) {
  const wrapperRef = useRef()
  const svgRef = useRef()
  const areaRef = useRef()
  const valueStore = useRef()
  const { width, height, chartHeight, chartWidth } = useDimensions({
    ref: wrapperRef,
    margin,
  })
  const prevDomain = usePrevious(domain)

  const getPadding = () => (domain[1] - domain[0]) * 0.025
  function initVis() {
    const yScale = scaleLinear()
      .domain(
        domain.map((el, i) => (i ? el + getPadding() : el - getPadding()))
      )
      .range([chartHeight, 0])
    valueStore.current = {
      yScale,
    }
    createBoxPlot()
  }

  useEffect(() => {
    if(init && !_.isEqual(domain, prevDomain)) {
      updateVisData()
    }
  })

  function updateVisData() {
    const { yScale } = valueStore.current
    yScale.domain(
      domain.map((el, i) => (i ? el + getPadding() : el - getPadding()))
    )
    valueStore.current = {
      yScale,
    }
    updateBoxPlot()
  }

  function updateVisDims() {
    const { yScale } = valueStore.current
    yScale.range([chartHeight, 0])
    valueStore.current = {
      yScale,
    }
    updateBoxPlot(0)
  }

  function createBoxPlot() {
    const { yScale } = valueStore.current
    const chartArea = select(areaRef.current)
    const { q1, median, q3, r0, r1 } = data

    chartArea
      .append("line")
      .attr("class", "bg-line")
      .attr("x1", chartWidth / 2)
      .attr("x2", chartWidth / 2)
      .attr("y1", yScale(r0))
      .attr("y2", yScale(r1))
      .attr("stroke", grayLighter)

    chartArea
      .append("rect")
      .attr("height", yScale(q1) - yScale(q3))
      .attr("width", chartWidth)
      .attr("x", 0)
      .attr("y", yScale(q3))
      .attr("fill", grayLighter)

    chartArea
      .append("line")
      .attr("class", "median")
      .attr("x1", 0)
      .attr("x2", chartWidth)
      .attr("y1", yScale(median))
      .attr("y2", yScale(median))
      .attr("stroke", "#fff")
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function updateBoxPlot(duration = mdNum) {
    const { yScale } = valueStore.current
    const chartArea = select(areaRef.current)
    const { q1, median, q3, r0, r1 } = data

    chartArea
      .select(".bg-line")
      .transition()
      .duration(duration)
      .ease(easeCubicInOut)
      .attr("x1", chartWidth / 2)
      .attr("x2", chartWidth / 2)
      .attr("y1", yScale(r0))
      .attr("y2", yScale(r1))
      .attr("stroke", isFiltered ? grayDarkest : grayLighter)

    chartArea
      .select("rect")
      .transition()
      .duration(duration)
      .ease(easeCubicInOut)
      .attr("height", yScale(q1) - yScale(q3))
      .attr("width", chartWidth)
      .attr("y", yScale(q3))
      .attr("fill", isFiltered ? grayDarkest : grayLighter)

    chartArea
      .select(".median")
      .transition()
      .duration(duration)
      .ease(easeCubicInOut)
      .attr("x2", chartWidth)
      .attr("y1", yScale(median))
      .attr("y2", yScale(median))
  }

  const { init } = useInitUpdate({
    data: data,
    chartHeight,
    chartWidth,
    initVis,
    noKey: true,
    dataToCheck: data && Object.values(data),
    updateVisData,
    updateVisDims,
    yScaleDomain: domain,
  })

  const prevIsFiltered = usePrevious(isFiltered)
  useEffect(() => {
    if (init && prevIsFiltered !== isFiltered) {
      updateBoxPlot()
    }
  }, [init, isFiltered, prevIsFiltered, updateBoxPlot])

  return (
    <FlexContainer pos="relative" fullSize ref={wrapperRef}>
      <ChartSvg absPos ref={svgRef} width={width} height={height}>
        <ChartArea
          ref={areaRef}
          marginLeft={margin.left}
          marginTop={margin.top}
        />
      </ChartSvg>
    </FlexContainer>
  )
}

VerticalBoxPlot.defaultProps = {
  margin: {
    top: 5,
    right: 20,
    bottom: 5,
    left: 20,
  },
}
