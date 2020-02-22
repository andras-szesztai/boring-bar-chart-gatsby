import React, { useRef } from "react"
import { scaleBand } from "d3-scale"
import { select } from "d3-selection"
import chroma from "chroma-js"

import { ChartStarter } from "../../../molecules/charts"
import { useChartRefs, useDimensions, useInitUpdate } from "../../../../hooks"
import { COUNTRY_ORDER } from "../../../../constants/trustBiases"

export default function TrustBiasesChart({ data }) {
  const refs = useChartRefs()
  const valueStore = useRef()
  const dims = useDimensions({
    ref: refs.wrapperRef,
  })

  // mouseover && mouseclick

  function initVis() {
    const scale = scaleBand().domain(COUNTRY_ORDER)
    const xScale = scale.range([0, dims.chartHeight])
    const yScale = scale.range([dims.chartWidth, 0])
    const colorScale = chroma
      .scale(["yellow", "lightgreen", "008ae5"])
      .domain([-0.2, 0, 0.4])
    valueStore.current = {
      xScale,
      yScale,
    }
    createRectangles()
  }

  function createRectangles() {
    const { xScale, yScale } = valueStore.current
    console.log(data)

    select(refs.areaRef.current)
      .selectAll("rect")
      .data(data)
      .join(enter =>
        enter
          .append("rect")
          .attr("x", d => xScale(d.destination))
          .attr("y", d => yScale(d.origin))
          .attr("width", xScale.bandwidth())
          .attr("height", xScale.bandwidth())
          .attr("fill", "black")
      )
  }

  const { init } = useInitUpdate({
    data: data && Object.values(data),
    chartHeight: dims.chartHeight,
    chartWidth: dims.chartWidth,
    initVis,
  })

  return (
    <>
      <ChartStarter refs={refs} dims={dims} withXAxis axisBottom fontSize={0} />
    </>
  )
}
