import React from "react"
import { scaleLinear } from "d3-scale"
import { select } from "d3-selection"
import chroma from "chroma-js"
import "d3-transition"

import { ChartStarter } from "../../molecules/charts"
import { useChartRefs, useDimensions, useInitUpdate } from "../../../hooks"
import { extent } from "d3-array"
import { space } from "../../../themes/theme"

export default function HorizontalLinearGradient({
  data,
  margin,
  colorDomain,
  colorRange,
  endTexts,
  expTextSpace,
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
    const chartArea = select(refs.areaRef.current)
    const defs = chartArea.append("defs")
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

    chartArea
      .append("rect")
      .attr("width", dims.chartWidth)
      .attr("height", dims.chartHeight)
      .style("fill", "url(#linear-gradient)")

    chartArea
      .selectAll("text")
      .data(colorDomain)
      .enter()
      .append("text")
      .attr("x", setXPos)
      .attr("text-anchor", "middle")
      .attr("fill", (_, i) => chroma(colorRange[i]).darken(1))
      .attr("y", -10)
      .text(d => 100 * d)

    chartArea
      .selectAll("line")
      .data(colorDomain)
      .enter()
      .append("line")
      .attr("x1", setXPos)
      .attr("y1", -5)
      .attr("x2", setXPos)
      .attr("y2", dims.chartHeight)
      .attr("stroke", (_, i) => colorRange[i])

    chartArea
      .selectAll(".exp-text")
      .data(endTexts)
      .enter()
      .append("text")
      .attr("class", "exp-text")
      .attr("x", (_, i) => (i ? dims.chartWidth : 0))
      .attr("text-anchor", (_, i) => (i ? "end" : "start"))
      .attr("fill", (_, i) =>
        chroma(i ? colorRange[colorRange.length - 1] : colorRange[0]).darken(1)
      )
      .attr("y", dims.chartHeight + expTextSpace)
      .text(d => d)
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
  margin: { top: 20, bottom: 15, left: 10, right: 10 },
  expTextSpace: 12,
}
