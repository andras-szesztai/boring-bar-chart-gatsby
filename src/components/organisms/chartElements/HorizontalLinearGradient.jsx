import React from "react"
import { scaleLinear } from "d3-scale"
import { select } from "d3-selection"
import chroma from "chroma-js"
import "d3-transition"

import { ChartStarter } from "../../molecules/charts"
import { useChartRefs, useDimensions, useInitUpdate } from "../../../hooks"
import { extent } from "d3-array"
import { colors } from "../../../themes/theme"

export default function HorizontalLinearGradient({
  data,
  margin,
  colorDomain,
  colorRange,
}) {
  const refs = useChartRefs()
  const dims = useDimensions({
    ref: refs.wrapperRef,
    margin,
  })

  function initVis() {
    const xScale = scaleLinear()
      .range([0, dims.chartWidth])
      .domain(extent(colorDomain))
    const setXPos = d => xScale(d)
    const svg = select(refs.areaRef.current)
    const defs = svg.append("defs")
    const linearGradient = defs
      .append("linearGradient")
      .attr("id", "linear-gradient")

    linearGradient
      .selectAll("stop")
      .data(data)
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color)

    svg
      .append("rect")
      .attr("width", dims.chartWidth)
      .attr("height", dims.chartHeight)
      .style("fill", "url(#linear-gradient)")

    svg
      .selectAll("text")
      .data(colorDomain)
      .enter()
      .append("text")
      .attr("x", setXPos)
      .attr("text-anchor", "middle")
      .attr("fill", (d, i) => chroma(colorRange[i]).darken(1))
      .attr("y", -10)
      .text(d => 100 * d)

    svg
      .selectAll("line")
      .data(colorDomain)
      .enter()
      .append("line")
      .attr("x1", setXPos)
      .attr("y1", -5)
      .attr("x2", setXPos)
      .attr("y2", dims.chartHeight)
      .attr("stroke", (d, i) => colorRange[i])
  }

  useInitUpdate({
    data: data && Object.values(data),
    chartHeight: dims.chartHeight,
    chartWidth: dims.chartWidth,
    initVis,
  })

  return (
    <>
      <ChartStarter refs={refs} dims={dims} margin={margin} fontSize={1} />
    </>
  )
}

HorizontalLinearGradient.defaultProps = {
  margin: { top: 20, bottom: 10, left: 10, right: 10 },
}
