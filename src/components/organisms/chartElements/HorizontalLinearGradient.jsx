import React, { useRef } from "react"
import { scaleBand } from "d3-scale"
import { select } from "d3-selection"
import chroma from "chroma-js"
import "d3-transition"

import { ChartStarter } from "../../molecules/charts"
import { useChartRefs, useDimensions, useInitUpdate } from "../../../hooks"

export default function HorizontalLinearGradient({ data, margin }) {
  const refs = useChartRefs()
  const valueStore = useRef()
  const dims = useDimensions({
    ref: refs.wrapperRef,
    margin,
  })

  function initVis() {
    const defs = select(refs.areaRef.current).append("defs")
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

    select(refs.areaRef.current)
      .append("rect")
      .attr("width", dims.chartWidth)
      .attr("height", dims.chartHeight)
      .style("fill", "url(#linear-gradient)")
  }

  const { init } = useInitUpdate({
    data: data && Object.values(data),
    chartHeight: dims.chartHeight,
    chartWidth: dims.chartWidth,
    initVis,
  })

  return (
    <>
      <ChartStarter refs={refs} dims={dims} margin={margin} fontSize={0} />
    </>
  )
}

HorizontalLinearGradient.defaultProps = {
  margin: { top: 20, bottom: 10, left: 15, right: 0 },
}
