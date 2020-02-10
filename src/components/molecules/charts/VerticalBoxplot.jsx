import React, { useRef, useEffect } from "react"
import { select } from "d3-selection"
import _ from "lodash"
import "d3-transition"

import { FlexContainer, ChartSvg, ChartArea } from "../../atoms"
import { useDimensions, usePrevious } from "../../../hooks"
import { transition, colors, fontSize, fontWeight } from "../../../themes/theme"
import { useInitUpdate } from "../../../hooks"
import { scaleLinear } from "d3-scale"
import { easeCubicInOut } from "d3-ease"
import { numberTween } from "../../../utils/chartHelpers"

const { mdNum } = transition
const { grayDarkest, grayLighter } = colors

export default function VerticalBoxPlot({
  data,
  domain,
  margin,
  isFiltered,
  withText,
  numberFormat,
  transitionDuration,
}) {
  const prevData = usePrevious(data)
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
    withText && createUpdateBoxPlotText()
  }

  useEffect(() => {
    if (init && !_.isEqual(domain, prevDomain)) {
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
    withText && createUpdateBoxPlotText()
  }

  function updateVisDims() {
    const { yScale } = valueStore.current
    yScale.range([chartHeight, 0])
    valueStore.current = {
      yScale,
    }
    updateBoxPlot(0)
    withText && createUpdateBoxPlotText(0)
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
  function updateBoxPlot(duration = transitionDuration) {
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

  function createUpdateBoxPlotText(duration = transitionDuration) {
    const { yScale } = valueStore.current
    const getTextData = raw =>
      Object.keys(raw).map(key => ({ key, value: data[key] }))
    const textData = getTextData(data)
    const getNumberTween = (d, i, n) =>
      numberTween({
        value: getTextData(data).find(el => el.key === d.key).value,
        prevValue: prevData
          ? getTextData(prevData).find(el => el.key === d.key).value
          : 0,
        i,
        n,
        numberFormat,
      })
    const getFill = d =>
      isFiltered && ["q1", "median"].includes(d.key) ? grayLighter : grayDarkest
    select(areaRef.current)
      .selectAll("text")
      .data(textData, d => d.key)
      .join(
        enter =>
          enter
            .append("text")
            .attr("text-anchor", "middle")
            .attr("x", chartWidth / 2)
            .attr("y", d => yScale(d.value))
            .attr("dy", d => (d.key === "r0" ? 10 : -3))
            .attr("font-weight", fontWeight.medium)
            .text(0)
            .call(enter =>
              enter
                .transition()
                .duration(duration)
                .ease(easeCubicInOut)
                .tween("text", getNumberTween)
                .attr("fill", getFill)
            ),
        update =>
          update.call(update =>
            update
              .transition()
              .duration(duration)
              .ease(easeCubicInOut)
              .tween("text", getNumberTween)
              .attr("y", d => yScale(d.value))
              .attr("fill", getFill)
          )
      )
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
  numberFormat: "d",
  transitionDuration: mdNum,
}
