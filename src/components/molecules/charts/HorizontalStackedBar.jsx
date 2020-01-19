import React, { useRef } from "react"
import { ChartSvg, FlexContainer, ChartArea } from "../../atoms"
import { useDimensions, useInitUpdate } from "../../../hooks"
import { stack } from "d3-shape"
import { select } from "d3-selection"
import { scaleOrdinal } from "d3-scale"

export default function HorizontalStackedBar({ data, margin, colorRange }) {
  const wrapperRef = useRef()
  const svgRef = useRef()
  const areaRef = useRef()
  const valueStore = useRef() 
  const { width, height, chartWidth, chartHeight } = useDimensions(
    { ref: wrapperRef },
    margin
  )

  function initVis() {
    
    const keys = Object.keys(data)
    const colorScale = scaleOrdinal().domain(keys).range(colorRange)

    const series = stack().keys(keys)([data]) 
    const svg = select(svgRef.current)
    select(svgRef.current).append("g")
    .selectAll("g")
    .data(series)
    .join("g")
      // .attr("fill", d => color(d.key))
    console.log(series)
  }

  function updateVisData() {}

  const { init } = useInitUpdate({
    data,
    chartHeight,
    chartWidth,
    initVis,
    update: updateVisData,
  })
  
  function updateVisDims() {}

  return (
    <FlexContainer fullSize ref={wrapperRef}>
      <ChartSvg ref={svgRef} >
        <ChartArea
          ref={areaRef} 
          marginLeft={margin.left}
          marginTop={margin.top}
        />
      </ChartSvg>
    </FlexContainer>
  )
}
