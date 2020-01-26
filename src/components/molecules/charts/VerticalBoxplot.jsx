import React, { useRef } from "react"
import { select } from "d3-selection"

import { FlexContainer, ChartSvg, ChartArea } from "../../atoms"
import { useDimensions } from "../../../hooks"
import { transition } from "../../../themes/theme"
import { useInitUpdate } from "../../../hooks"
import { scaleLinear } from "d3-scale"

const { mdNum } = transition

export default function VerticalBoxPlot({ data, domain, margin }) {
  const wrapperRef = useRef()
  const svgRef = useRef()
  const areaRef = useRef()
  const valueStore = useRef()
  const { width, height, chartHeight, chartWidth } = useDimensions({
    ref: wrapperRef,
    margin,
  })

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
    createUpdateBoxPlot()
  }

  function updateVisData() {}

  function updateVisDims() {}

  function createUpdateBoxPlot() {
    const { yScale } = valueStore.current
    const chartArea = select(areaRef.current)
    const { q1, median, q3, r0, r1 } = data

    chartArea 
      .append("line")
      .attr("class", "bg-line")
      .attr("x1", chartWidth/2)
      .attr("x2", chartWidth/2)
      .attr("y1", yScale(r0))
      .attr("y2", yScale(r1))
      .attr("stroke", "#000")


    chartArea
      .append("rect")
      .attr("height", yScale(q1) - yScale(q3))
      .attr("width", chartWidth)
      .attr("x", 0)
      .attr("y", yScale(q3))

    chartArea
      .append("line")
      .attr("class", "median")
      .attr("x1", 0)
      .attr("x2", chartWidth)
      .attr("y1", yScale(median))
      .attr("y2", yScale(median))
      .attr("stroke", "#fff")
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
  })

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
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  },
}
