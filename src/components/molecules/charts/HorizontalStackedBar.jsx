import React, { useRef } from "react"
import { ChartSvg, FlexContainer, ChartArea } from "../../atoms"
import { useDimensions, useInitUpdate } from "../../../hooks"
import { stack } from "d3-shape"
import { select } from "d3-selection"
import { scaleOrdinal, scaleLinear } from "d3-scale"

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
    const colorScale = scaleOrdinal()
      .domain(keys)
      .range(colorRange)
    const xScale = scaleLinear()
      .domain([0, 1])
      .range([0, chartWidth])

    const series = stack().keys(keys)([data])

    select(svgRef.current)
      .append("g")
      .selectAll("g")
      .data(series)
      .join("g")
    // .attr("fill", d => color(d.key))

    valueStore.current = {
      colorScale,
      xScale,
    }
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
