import React, { useRef } from "react"
import { stack } from "d3-shape"
import { select } from "d3-selection"
import { scaleOrdinal, scaleLinear } from "d3-scale"
import chroma from 'chroma-js'

import { ChartSvg, FlexContainer, ChartArea } from "../../atoms"
import { useDimensions, useInitUpdate } from "../../../hooks"

export default function HorizontalStackedBar({ data, margin, colorRange }) {
  const wrapperRef = useRef()
  const svgRef = useRef()
  const areaRef = useRef()
  const valueStore = useRef()
  const { width, height, chartWidth, chartHeight } = useDimensions({
    ref: wrapperRef,
    margin,
  })
  
  function initVis() {
    const keys = Object.keys(data)
    const colorScale = scaleOrdinal()
      .domain(keys)
      .range(colorRange)
    const xScale = scaleLinear()
      .domain([0, 1])
      .range([0, chartWidth])

    const series = stack().keys(keys)([data])

    select(areaRef.current)
      .append("g")
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", d => colorScale(d.key))
      .attr("stroke", d => chroma(colorScale(d.key)).darken())
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", d => xScale(d[0]))
      .attr("width", d => xScale(d[1]) - xScale(d[0]))
      .attr("y", 0)
      .attr("height", chartHeight)

    valueStore.current = {
      colorScale,
      xScale,
    }
  }

  function updateVisData() {
    console.log('running');
  }

  const { init } = useInitUpdate({
    data: data && Object.values(data),
    chartHeight,
    chartWidth,
    initVis,
    noKey: true,
    updateVis: updateVisData,
  })

  function updateVisDims() {}

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
