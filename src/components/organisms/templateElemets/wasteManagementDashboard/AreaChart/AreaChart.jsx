import React, { useRef } from "react"
import { scaleTime, scaleLinear } from "d3-scale"
import { extent } from "d3-array"
import { area, curveMonotoneX } from "d3-shape"
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
import { transition } from "../../../../../themes/theme"
import { makeTransition } from "../../../../../utils/chartHelpers"
import { createUpdateDelaunayCircles } from "../../../../../utils/svgElementHelpers"

const yDomain = {
  abs: [0, 850],
  perc: [0, 1],
}

const metricArray = ["waste", "recycling_total", "recycling_composting"]

export default function AreaChart(props) {
  const { data, margin, metric, value, withAxes, withLabel } = props
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
    const delaunayData = metricArray
      .map(metric => data.map(d => ({ ...d, metricValue: d[metric], metric })))
      .flat()
    storedValues.current = {
      yScale,
      xScale,
      chartArea,
      data: delaunayData,
      dims,
    }
    createUpdateSingleArea({
      isInit: true,
      color: "#de88a5",
      accessor: "waste",
    })
    createUpdateSingleArea({
      isInit: true,
      color: "#7a9eaf",
      accessor: "recycling_total",
    })
    createUpdateSingleArea({
      isInit: true,
      color: "#655989",
      accessor: "recycling_composting",
    })
    createUpdateDelaunayCircles({
      props: {
        xKey: "year",
        yKey: "metricValue",
        hoverRadius: 10,
        unitKey: "country",
      },
      storedValues,
      functions: {},
    })
    select(refs.xAxisRef.current).raise()
    select(refs.yAxisRef.current).raise()
  }

  function updateVisData() {
    const { yScale } = storedValues.current
    yScale.domain(yDomain[metric])
    storedValues.current = {
      ...storedValues.current,
      yScale,
    }
    metricArray.forEach(metric =>
      createUpdateSingleArea({
        accessor: metric,
      })
    )
  }

  function updateVisDims() {
    const { xScale, yScale } = storedValues.current
    xScale.range([0, dims.chartWidth])
    yScale.range([dims.chartHeight, 0])
    storedValues.current = {
      ...storedValues.current,
      yScale,
      xScale,
    }
    metricArray.forEach(metric =>
      createUpdateSingleArea({
        accessor: metric,
      })
    )
  }

  function createUpdateSingleArea({ isInit, color, accessor }) {
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
      .y1(d => yScale(d[accessor]))

    if (isInit) {
      chartArea
        .append("path")
        .datum(data)
        .attr("class", accessor)
        .attr("fill", color)
        .attr("d", areaGeneratorZero)
      chartArea
        .select(`.${accessor}`)
        .transition(t)
        .attr("d", areaGenerator)
    }

    if (!isInit) {
      chartArea
        .select(`.${accessor}`)
        .datum(data)
        .transition(t)
        .attrTween("d", (d, i, n) =>
          interpolatePath(select(n[i]).attr("d"), areaGenerator(d))
        )
    }
  }

  useInitUpdate({
    data: data,
    chartHeight: dims.chartHeight,
    chartWidth: dims.chartWidth,
    initVis,
    updateVisData,
    updateVisDims,
  })

  return (
    <ChartWrapper ref={refs.wrapperRef}>
      {withLabel && (
        <Container absPos left={margin.left - 1} top={0}>
          {value}
        </Container>
      )}
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
                color="grayDarkest"
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
                color="grayDarkest"
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
  margin: { top: 20, right: 0, bottom: 5, left: 5 },
}
