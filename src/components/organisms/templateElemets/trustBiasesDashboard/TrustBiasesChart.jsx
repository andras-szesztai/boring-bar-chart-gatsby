import React, { useRef } from "react"
import { scaleBand } from "d3-scale"
import { select } from "d3-selection"
import chroma from "chroma-js"
import "d3-transition"

import { ChartStarter } from "../../../molecules/charts"
import { useChartRefs, useDimensions, useInitUpdate } from "../../../../hooks"
import { COUNTRY_ORDER } from "../../../../constants/trustBiases"
import { colors } from "../../../../themes/theme"
import { interpolateString } from "d3-interpolate"

export default function TrustBiasesChart({ data }) {
  const refs = useChartRefs()
  const valueStore = useRef()
  const dims = useDimensions({
    ref: refs.wrapperRef,
  })

  // mouseover && mouseclick

  function initVis() {
    const scale = scaleBand().domain(COUNTRY_ORDER)
    const xScale = scale.range([0, dims.chartWidth])
    const yScale = scale.range([0, dims.chartHeight])
    const colorScale = chroma
      .scale(["#ef6c7f", "#ece2ec", "#415f77"])
      .domain([-0.15, 0, 0.2])
    const chartArea = select(refs.areaRef.current)
    valueStore.current = {
      xScale,
      yScale,
      colorScale,
      chartArea,
    }
    createRectangles()
  }

  function createRectangles() {
    const { xScale, yScale, colorScale, chartArea } = valueStore.current
    chartArea
      .selectAll("rect")
      .data(data)
      .join(enter =>
        enter
          .append("rect")
          .attr("x", d => xScale(d.origin))
          .attr("y", d => yScale(d.destination))
          .attr("width", xScale.bandwidth())
          .attr("height", xScale.bandwidth())
          .attr("fill", d =>
            +d.trust !== 100 ? colorScale(+d.trust) : colors.grayLighter
          )
          .attr("stroke", "#fff")
          .on("mouseover", onMouseover)
          .on("click", onClick)
      )
  }

  var interpol_rotate = interpolateString(
    "rotate(0,60,140)",
    "rotate(-180,60,140)"
  )
  var interpol_rotate_back = interpolateString(
    "rotate(-180,60,140)",
    "rotate(0,60,140)"
  )

  function onMouseover(d, i, n) {
    const { chartArea, xScale, yScale } = valueStore.current
    const origin = d.origin
    const dest = d.destination
    select(n[i])
      .transition()
      .attrTween("transform", (d,i,a) => interpol_rotate )

    console.log(dest)
    console.log(origin)
  }

  function onClick(d) {
    console.log(d, "clicked")
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
