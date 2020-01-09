import React, { useRef } from "react"
import { scaleLinear } from "d3-scale"
import { select } from "d3-selection"
import { area } from "d3-shape"
import _ from "lodash"

import { ChartWrapper, ChartSvg, ChartArea } from "../../atoms"
import { useDimensions } from "../../../hooks"
import useInitUpdate from "../../../hooks/useInitUpdate"

export default function VerticalDropChart({ data, domain, colors, margin }) {
  const wrapperRef = useRef()
  const svgRef = useRef()
  const areaRef = useRef()
  const valueStore = useRef()
  const { width, height, chartWidth } = useDimensions(wrapperRef)
  const lgRadius = height * 0.15
  const smRadius = height * 0.025

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
        vals = { dx: -lgRadius, anchor: "end"}
        break
      case (year === 2008 && diff > 0):
        vals = { dx: -smRadius, anchor: "end"}
        break
      case (year === 2017 && diff > 0) || (year === 2008 && diff < 0) || (year === 2017 && diff === 0):
        vals = { dx: 10, anchor: "start"}
        break
      default:
        vals = { dx: 0, anchor: "middle"}
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
          .attr("fill", d => getColor(d.difference))
          .text(d => d.perc + "%")
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
      .selectAll("text")
      .data(textData)
      .join(enter =>
        enter
          .append("text")
          .attr("text-anchor", "middle")
          .attr("x", xScale(_.mean(percentages)))
          .attr("y", height / 2)
          .attr("dy", -lgRadius * 1.5)
          .attr("fill", d => getColor(d.difference))
          .text(d => d.Sport)
      )
  }

  function createUpdateAreas() {
    const { xScale } = valueStore.current
    const getOffset = d => (isRecent(d) ? lgRadius : smRadius)
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

  useInitUpdate({ data, chartHeight: height, chartWidth, initVis })

  return (
    <ChartWrapper ref={wrapperRef}>
      <ChartSvg ref={svgRef} width={width} height={height}>
        <ChartArea ref={areaRef} marginLeft={margin.left} />
      </ChartSvg>
    </ChartWrapper>
  )
}
