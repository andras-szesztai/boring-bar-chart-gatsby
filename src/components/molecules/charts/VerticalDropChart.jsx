import React, { useRef } from "react"
import { scaleLinear } from "d3-scale"
import { select } from "d3-selection"
import { area } from "d3-shape"

import { ChartWrapper, ChartSvg } from "../../atoms"
import { useDimensions } from "../../../hooks"
import useInitUpdate from "../../../hooks/useInitUpdate"

export default function VerticalDropChart({ data, domain, colors }) {
  const wrapperRef = useRef()
  const svgRef = useRef()
  const valueStore = useRef()
  const { width, height } = useDimensions(wrapperRef)
  const lgRadius = height * 0.15
  const smRadius = height * 0.01

  function initVis() {
    const xScale = scaleLinear()
      .domain(domain)
      .range([width, 0])   
    valueStore.current = {
      xScale,
    }
    createUpdateAreas()
    createUpdateCircles()
  }

  const isRecent = d => d.year === 2017

  function createUpdateAreas() {
    const { xScale } = valueStore.current
    const getOffset = d => isRecent(d) ? lgRadius : smRadius
    select(svgRef.current)
      .append("path")
      .datum(data)
      .attr("fill", colors.smDecline)
      .attr(
        "d",
        area()
          .x(d => xScale(d.perc))
          .y1(d => height / 2 - (getOffset(d)))
          .y0(d => height / 2 + (getOffset(d)))
      )
  }

  function createUpdateCircles() {
    const { xScale } = valueStore.current
    
    select(svgRef.current)
      .selectAll("circle")
      .data(data.sort((a, b) => b.perc - a.perc), d => d.year)
      .join(enter =>
        enter
          .append("circle")
          .attr("fill", colors.smDecline)
          .attr("cy", height / 2)
          .attr("cx", d => xScale(+d.perc))
          .attr("r", d => (isRecent(d) ? lgRadius : smRadius))
          .call(enter => enter)
      )
  }

  useInitUpdate({ data, chartHeight: height, chartWidth: width, initVis })

  return (
    <ChartWrapper ref={wrapperRef}>
      <ChartSvg ref={svgRef} width={width} height={height} />
    </ChartWrapper>
  )
}
