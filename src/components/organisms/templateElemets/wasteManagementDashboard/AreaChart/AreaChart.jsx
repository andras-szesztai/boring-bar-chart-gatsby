import React, { useRef } from "react"
import { scaleTime, scaleLinear } from "d3-scale"
import { extent } from "d3-array"
import { area, curveMonotoneX, stack } from "d3-shape"
import { select } from "d3-selection"
import "d3-transition"
import { interpolatePath } from "d3-interpolate-path"

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
import { makeTransition } from "../../../../../utils/chartHelpers"

const yDomain = {
  abs: [0, 800],
  perc: [0, 1],
}

export default function AreaChart(props) {
  const { data, margin, metric, value, withAxes } = props
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
    createUpdateSingleArea(true)
    createUpdateStackedArea()
  }

  function updateVisData() {
    const { yScale } = storedValues.current
    yScale.domain(yDomain[metric])
    storedValues.current = {
      ...storedValues.current,
      yScale,
    }
    createUpdateSingleArea()
    createUpdateStackedArea()
  }

  function createUpdateSingleArea(isInit) {
    const { yScale, xScale, chartArea } = storedValues.current
    const t = makeTransition(chartArea, transition.lgNum)
    const areaGeneratorZero = area()
      .x(d => xScale(d.year))
      .y0(yScale(0))
      .y1(yScale(0))
      .curve(curveMonotoneX)
    const areaGenerator = area()
      .curve(curveMonotoneX)
      .x(d => xScale(d.year))
      .y0(yScale(0))
      .y1(d => yScale(d.waste))

    if (isInit) {
      chartArea
        .append("path")
        .datum(data)
        .attr("class", "total-area")
        .attr("fill", "#E595AF")
        .attr("fill-opacity", 0.6)
        .attr("d", areaGeneratorZero)
      chartArea
        .select(".total-area")
        .transition(t)
        .attr("d", areaGenerator)
    }

    if (!isInit) {
      chartArea
        .select(".total-area")
        .datum(data)
        .transition(t)
        .attrTween("d", (d, i, n) => {
          const previous = select(n[i]).attr("d")
          const next = areaGenerator(d)
          return interpolatePath(previous, next)
        })
    }
  }

  function createUpdateStackedArea() {
    const { yScale, xScale, chartArea } = storedValues.current
    const t = makeTransition(chartArea, transition.lgNum)
    const areaGeneratorZero = area()
      .x(d => xScale(d.data.year))
      .y0(yScale(0))
      .y1(yScale(0))
      .curve(curveMonotoneX)

    const areaGenerator = area()
      .x(d => xScale(d.data.year))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(curveMonotoneX)

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
              d.key === "recycling_material" ? "#655989" : "#7a9eaf"
            )
            .attr("d", areaGeneratorZero)
            .call(enter => enter.transition(t).attr("d", areaGenerator)),
        update =>
          update.call(update =>
            update
              .transition(t)
              .duration(transition.lgNum)
              .ease(easeCubicInOut)
              .attrTween("d", (d, i, n) => {
                const previous = select(n[i]).attr("d")
                const next = areaGenerator(d)
                return interpolatePath(previous, next)
              })
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
        {withAxes && (
          <>
            <ChartArea
              ref={refs.xAxisRef}
              marginLeft={margin.left}
              marginTop={margin.top + dims.chartHeight}
            >
              <AxisLine
                color="grayLightest"
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
                color="grayLightest"
                x1={0}
                x2={0}
                y2={0}
                y1={dims.chartHeight}
              />
            </ChartArea>
          </>
        )}
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
