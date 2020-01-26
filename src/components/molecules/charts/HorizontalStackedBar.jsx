import React, { useRef } from "react"
import { stack } from "d3-shape"
import { select } from "d3-selection"
import { scaleOrdinal, scaleLinear } from "d3-scale"
import chroma from 'chroma-js'
import "d3-transition"

import { ChartSvg, FlexContainer, ChartArea } from "../../atoms"
import { useDimensions, useInitUpdate } from "../../../hooks"
import { easeCubicInOut } from "d3-ease"

export default function HorizontalStackedBar({ data, margin, colorRange }) {
  const wrapperRef = useRef()
  const svgRef = useRef()
  const areaRef = useRef()
  const valueStore = useRef()
  const { width, height, chartWidth, chartHeight } = useDimensions({
    ref: wrapperRef,
    margin,
  })

  const makeData = keys => stack().keys(keys)([data])
  
  function initVis() {
    const keys = Object.keys(data)
    const colorScale = scaleOrdinal()
      .domain(keys)
      .range(colorRange)
    const xScale = scaleLinear()
      .domain([0, 1])
      .range([0, chartWidth])
    valueStore.current = {
      colorScale,
      xScale,
    }
    createUpdateRectangles()
  }

  function updateVisData() {
    createUpdateRectangles()
  }

  function updateVisDims() {
    
  }


  function createUpdateRectangles(){
    const { xScale, colorScale } = valueStore.current    
    select(areaRef.current).selectAll("rect")
    .data(makeData(Object.keys(data)))
    .join(
      enter => enter.append("rect")
        .attr("fill", d => colorScale(d.key))
        .attr("stroke", d => chroma(colorScale(d.key)).darken())
        .attr("x", d => xScale(d[0][0]))
        .attr("width", d => xScale(d[0][1]) - xScale(d[0][0]))
        .attr("y", 0)
        .attr("height", chartHeight)
        .call(enter => enter),
      update => update
        .call(update => update
          .transition()
          .duration(300)  
          .ease(easeCubicInOut)
          .attr("x", d => xScale(d[0][0]))
          .attr("width", d =>  xScale(d[0][1]) - xScale(d[0][0]))
        )
    );
  }

  useInitUpdate({
    data: data && Object.values(data),
    chartHeight,
    chartWidth,
    initVis,
    noKey: true,
    updateVisData,
  })


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
