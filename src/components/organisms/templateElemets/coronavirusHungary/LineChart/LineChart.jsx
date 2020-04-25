import React, { useEffect, useState, useRef } from "react"

import { AxisLine, ChartArea, ChartWrapper, ChartSvg } from "../../../../atoms"
import { useChartRefs, useDimensions } from "../../../../../hooks"
import { scaleTime, scaleOrdinal } from "d3-scale"
import { extent } from "d3-array"
import { nest } from "d3-collection";
import { select } from "d3-selection"
import { line, curveMonotoneX } from "d3-shape"

export default function LineChart({ data, currDate, margin }) {
  const { svgRef, wrapperRef, yAxisRef, xAxisRef } = useChartRefs()
  const dims = useDimensions({
    ref: wrapperRef,
    margin,
  })
  const [init, setInit] = useState(false)
  const storedValues = useRef()

  useEffect(() => {
    function createUpdateLines() {
      const { yScale, xScale, area } = storedValues.current
      const lineGenerator = line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value))
        .curve(curveMonotoneX)
      const nestedData = nest()
        .key(({ key }) => key)
        .entries(data)
      area
        .selectAll(".line")
        .data(nestedData, d => d.key)
        .join(enter =>
          enter
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", lineGenerator)
            .call(enter => enter)
        )
    }
    if (!init && data && dims.chartHeight) {
      const xScale = scaleTime()
        .domain(extent(data, ({ date }) => date))
        .range([0, dims.chartWidth])
      const yScale = scaleOrdinal()
        .domain(extent(data, ({ value }) => value))
        .range([dims.chartHeight, 0])
      const area = select(svgRef.current)
      storedValues.current = {
        yScale,
        xScale,
        area,
      }
      createUpdateLines()
      setInit(true)
    }
  }, [init, data, dims, svgRef])

  return (
    <ChartWrapper areaRef={wrapperRef}>
      <ChartSvg absPos areaRef={svgRef} width={dims.width} height={dims.height}>
        <ChartArea
          marginLeft={margin.left}
          marginTop={margin.top}
          areaRef={yAxisRef}
        >
          <AxisLine
            color="grayDarkest"
            stroke={0.5}
            y1={0}
            y2={dims.chartHeight}
          />
        </ChartArea>
        <ChartArea
          marginLeft={margin.left}
          marginTop={margin.top + dims.chartHeight}
          areaRef={xAxisRef}
        >
          <AxisLine
            color="grayDarkest"
            stroke={0.5}
            x1={0}
            x2={dims.chartWidth}
          />
        </ChartArea>
      </ChartSvg>
    </ChartWrapper>
  )
}

LineChart.defaultProps = {
  margin: { top: 15, right: 10, bottom: 25, left: 25 },
}
