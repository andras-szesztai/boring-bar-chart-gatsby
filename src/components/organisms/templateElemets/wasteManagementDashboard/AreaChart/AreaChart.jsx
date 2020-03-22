import React, { useRef } from "react"
import { scaleTime, scaleLinear } from "d3-scale"
import { extent } from "d3-array"
import { area, curveCatmullRom, stack } from "d3-shape"
import { nest } from "d3-collection"
import { select } from "d3-selection"
import "d3-transition"

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
import { colors, transition } from "../../../../../themes/theme"
import { easeCubicInOut } from "d3-ease"

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

  const isAbs = metric === "abs"

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
    createUpdateSingleArea({ isInit: true })
    createUpdateStackedArea()
  }

  function updateVisData() {
    const { yScale } = storedValues.current
    yScale.domain(yDomain[metric])
    storedValues.current = {
      ...storedValues.current,
      yScale,
    }
    createUpdateSingleArea({})
    createUpdateStackedArea()
  }

  function createUpdateSingleArea({ isInit }) {
    const { yScale, xScale, chartArea } = storedValues.current
    const areaGenerator = area()
      .curve(curveCatmullRom.alpha(1))
      .x(d => xScale(d.data.year))
      .y0(yScale(0))
      .y1(d => yScale(d.data.waste))

    chartArea
      .selectAll(".total-area")
      .data([{ data }])
      .join(enter =>
        enter
          .append("path")
          .attr("class", "total-area")
          .attr("fill", colors.grayLightest)
          .attr("d", areaGenerator)
      )

    // if (isInit) {
    //   chartArea
    //     .append("path")
    //     .datum(data)
    //     .attr("class", "total-area")
    //     .attr("fill", colors.grayLightest)
    //     .attr("d", areaGenerator)
    // }

    // if (!isInit) {
    //   chartArea
    //     .select(".total-area")
    //     .datum(data)
    //     .transition("update")
    //     .duration(transition.lgNum)
    //     .ease(easeCubicInOut)
    //     .attr("d", areaGenerator)
    // }
  }

  function createUpdateStackedArea() {
    const { yScale, xScale, chartArea } = storedValues.current

    const areaGenerator = area()
      .x(d => xScale(d.data.year))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))

    var stackedData = stack().keys([
      "recycling_material",
      "recycling_composting",
    ])(data)

    chartArea
      .selectAll(".rec-area")
      .data(stackedData)
      .join(
        enter =>
          enter
            .append("path")
            .attr("class", "rec-area")
            .attr("fill", d =>
              d.key === "recycling_material" ? "#7a9eaf" : "#655989"
            )
            .attr("d", areaGenerator)
            .call(enter => enter),
        update =>
          update.call(update =>
            update
              .transition("update")
              .duration(transition.lgNum)
              .ease(easeCubicInOut)
              .attr("d", areaGenerator)
          )
      )
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
          {/* <AxisLine
            color="grayLightest"
            x1={0}
            x2={dims.chartWidth}
            y2={0}
            y1={0}
          /> */}
        </ChartArea>
        <ChartArea
          ref={refs.yAxisRef}
          marginLeft={margin.left}
          marginTop={margin.top}
        >
          {/* <AxisLine
            color="grayLightest"
            x1={0}
            x2={0}
            y2={0}
            y1={dims.chartHeight}
          /> */}
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
