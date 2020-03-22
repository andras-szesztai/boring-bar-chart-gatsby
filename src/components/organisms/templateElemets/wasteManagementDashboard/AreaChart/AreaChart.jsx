import React, { useRef } from "react"
import { scaleTime, scaleLinear } from "d3-scale"
import { extent } from "d3-array"
import { area, curveCatmullRom } from "d3-shape"
import { select } from "d3-selection"

import {
  useChartRefs,
  useDimensions,
  useInitUpdate,
} from "../../../../../hooks"
import {
  ChartWrapper,
  ChartSvg,
  ChartArea,
  AxisLine,
  Container,
} from "../../../../atoms"
import { colors } from "../../../../../themes/theme"

const yDomain = {
  abs: [0, 800],
  perc: [0, 1],
}

export default function AreaChart({ data, margin, metric, value }) {
  const refs = useChartRefs()
  const storedValues = useRef()
  const dims = useDimensions({
    ref: refs.wrapperRef,
    margin,
  })

  function initVis() {
    const xScale = scaleTime()
      .domain(extent(data, d => d.year))
      .range([0, dims.chartWidth])
    const yScale = scaleLinear()
      .domain(yDomain[metric])
      .range([dims.chartHeight, 0])
    const chartArea = select(refs.areaRef.current)
    storedValues.current = {
      yScale,
      xScale,
      chartArea,
    }
    createUpdateSingleArea()
  }

  function updateVisData() {
    const { yScale } = storedValues.current
    yScale.domain(yDomain[metric])
    storedValues.current = {
      ...storedValues.current,
      yScale,
    }
    createUpdateSingleArea()
  }

  function createUpdateSingleArea(duration) {
    const { yScale, xScale, chartArea } = storedValues.current
    const areaGenerator = area()
      .curve(curveCatmullRom.alpha(1))
      .x(d => xScale(d.year))
      .y0(yScale(0))
      .y1(d => yScale(d.waste))

    console.log({ data })

    chartArea
      .append("path")
      .datum(data)
      .attr("fill", colors.grayLighter)
      .attr("d", areaGenerator)
    // chartArea
    //   .selectAll(".total-area")
    //   .datum({ data })
    //   .join(enter =>
    //     enter
    //       .append("path")
    //       .attr("class", "total-area")
    //       .attr("fill", "steelblue")
    //       .attr("d", areaGenerator)
    //   )
    // vg.append("path")
    //   .datum(data)n
    //   .attr("fill", "steelblue")
    //   .attr("d", area);
  }

  useInitUpdate({
    data: data,
    chartHeight: dims.chartHeight,
    chartWidth: dims.chartWidth,
    initVis,
    updateVisData,
    // updateVisDims,
  })

  return (
    <ChartWrapper ref={refs.wrapperRef}>
      <Container absPos left={margin.left - 1} top={0}>
        {value}
      </Container>
      <ChartSvg
        absPos
        ref={refs.svgRef}
        width={dims.width}
        height={dims.height}
      >
        <ChartArea
          ref={refs.xAxisRef}
          marginLeft={margin.left}
          marginTop={margin.top + dims.chartHeight}
        >
          <AxisLine
            color="grayLighter"
            x1={0}
            x2={dims.chartWidth}
            y2={0}
            y1={0}
          />
        </ChartArea>
        <ChartArea
          ref={refs.yAxisRef}
          marginLeft={margin.left}
          marginTop={margin.top}
        >
          <AxisLine
            color="grayLighter"
            x1={0}
            x2={0}
            y2={0}
            y1={dims.chartHeight}
          />
        </ChartArea>
        <ChartArea
          ref={refs.areaRef}
          marginLeft={margin.left}
          marginTop={margin.top}
        />
      </ChartSvg>
    </ChartWrapper>
  )
}

AreaChart.defaultProps = {
  margin: { top: 20, right: 5, bottom: 5, left: 5 },
}
