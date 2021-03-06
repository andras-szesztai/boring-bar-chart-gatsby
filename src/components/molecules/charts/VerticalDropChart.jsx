import React, { useRef, useEffect } from "react"
import { scaleLinear } from "d3-scale"
import { select } from "d3-selection"
import { area } from "d3-shape"
import _ from "lodash"
import "d3-transition"

import { ChartWrapper, ChartSvg, ChartArea } from "../../atoms"
import {
  useDimensions,
  usePrevious,
  useInitUpdate,
  useDimsUpdate,
} from "../../../hooks"

export default function VerticalDropChart({
  data,
  domain,
  colors,
  margin,
  displayedYears,
  parentRef,
}) {
  const wrapperRef = useRef()
  const svgRef = useRef()
  const areaRef = useRef()
  const valueStore = useRef()
  const { width, height, chartWidth } = useDimensions({
    ref: wrapperRef,
    margin,
    parentRef,
    parentWidth: true,
  })
  
  const lgRadius = height * 0.15
  const smRadius = height * 0.025

  const prevDisplayedYears = usePrevious(displayedYears)
  useEffect(() => {
    const newDisplayed = displayedYears.map(el => el.checked)
    const prevDisplayed =
      prevDisplayedYears && prevDisplayedYears.map(el => el.checked)
    if (prevDisplayed && !_.isEqual(newDisplayed, prevDisplayed)) {
      displayHidePercText()
    }
  })

  function initVis() {
    const xScale = scaleLinear()
      .domain(domain)
      .range([0, chartWidth])
    valueStore.current = {
      xScale,
    }
    createUpdateAreas()
    createUpdateCircles()
    createUpdateText()
    createUpdatePercText()
  }

  const isRecent = d => d.year === 2017

  function getColor(val) {
    let color
    switch (true) {
      case val === -4:
        color = colors.lgDecline
        break
      case val === 4:
        color = colors.lgGrowth
        break
      default:
        color = colors.neu
    }
    return color
  }

  function getVals({ year, difference: diff }) {
    let vals
    switch (true) {
      case (year === 2017 && diff < 0) || (year === 2008 && diff === 0):
        vals = { dx: -lgRadius - 10, anchor: "end" }
        break
      case year === 2008 && diff > 0:
        vals = { dx: -smRadius - 10, anchor: "end" }
        break
      case (year === 2017 && diff > 0) || (year === 2017 && diff === 0):
        vals = { dx: lgRadius + 10, anchor: "start" }
        break
      case year === 2008 && diff < 0:
        vals = { dx: smRadius + 10, anchor: "start" }
        break
      default:
        vals = { dx: 0, anchor: "middle" }
    }
    return vals
  }

  function createUpdatePercText() {
    const { xScale } = valueStore.current
    select(areaRef.current)
      .selectAll(".perc-text")
      .data(data)
      .join(enter =>
        enter
          .append("text")
          .attr("class", "perc-text")
          .attr("text-anchor", d => getVals(d).anchor)
          .attr("x", d => xScale(d.perc))
          .attr("dx", d => getVals(d).dx)
          .attr("y", height / 2)
          .attr("dy", 4)
          .attr("opacity", 0)
          .attr("fill", d => getColor(d.difference))
          .text(d => d.perc + "%")
      )
  }

  function displayHidePercText() {
    select(areaRef.current)
      .selectAll(".perc-text")
      .transition("highlight")
      .attr("opacity", d =>
        displayedYears.filter(y => y.text === d.year)[0].checked ? 1 : 0
      )
  }

  function createUpdateText() {
    const { xScale } = valueStore.current
    const percentages = data.sort((a, b) => a.year - b.year).map(d => d.perc)
    const isRecentGreater = percentages[0] >= percentages[1]
    const textData = data.filter(d =>
      isRecentGreater ? d.year === 2017 : d.year === 2008
    )
    select(areaRef.current)
      .selectAll(".label")
      .data(textData)
      .join(enter =>
        enter
          .append("text")
          .attr("class", "label")
          .attr("text-anchor", "middle")
          .attr("x", xScale(_.mean(percentages)))
          .attr("y", height / 2)
          .attr("dy", -lgRadius * 1.5)
          .attr("fill", d => getColor(d.difference))
          .text(d => d.Sport)
      )
    valueStore.current = {
      ...valueStore.current,
      perc: percentages,
    }
  }

  const getOffset = d => (isRecent(d) ? lgRadius : smRadius)
  function createUpdateAreas() {
    const { xScale } = valueStore.current
    select(areaRef.current)
      .append("path")
      .datum(data)
      .attr("fill", d => getColor(d[0].difference))
      .attr("opacity", 0.25)
      .attr(
        "d",
        area()
          .x(d => xScale(d.perc))
          .y1(d => height / 2 - getOffset(d))
          .y0(d => height / 2 + getOffset(d))
      )
  }

  function createUpdateCircles() {
    const { xScale } = valueStore.current
    select(areaRef.current)
      .selectAll("circle")
      .data(data.sort((a, b) => b.perc - a.perc), d => d.year)
      .join(enter =>
        enter
          .append("circle")
          .attr("fill", d => getColor(d.difference))
          .attr("cy", height / 2)
          .attr("cx", d => xScale(+d.perc))
          .attr("r", d => (isRecent(d) ? lgRadius : smRadius))
          .call(enter => enter)
      )
  }

  const { init } = useInitUpdate({
    data,
    chartHeight: height,
    chartWidth,
    initVis,
  })

  function updateDims() {
    const { xScale, perc } = valueStore.current
    xScale.range([0, chartWidth])
    const chartArea = select(areaRef.current)
    chartArea.selectAll("path").attr(
      "d",
      area()
        .x(d => xScale(d.perc))
        .y1(d => height / 2 - getOffset(d))
        .y0(d => height / 2 + getOffset(d))
    )
    chartArea.selectAll("circle").attr("cx", d => xScale(+d.perc))
    chartArea.selectAll(".label").attr("x", xScale(_.mean(perc)))
    chartArea.selectAll(".perc-text").attr("x", d => xScale(d.perc))
    valueStore.current = {
      ...valueStore.current,
      xScale,
    }
  }
  useDimsUpdate({ updateDims, init, width, height })

  return (
    <>
      <ChartWrapper areaRef={wrapperRef}>
        <ChartSvg areaRef={svgRef} width={width} height={height}>
          <ChartArea areaRef={areaRef} marginLeft={margin.left} />
        </ChartSvg>
      </ChartWrapper>
    </>
  )
}
