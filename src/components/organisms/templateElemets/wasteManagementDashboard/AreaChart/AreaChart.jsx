import React, { useRef, useEffect, useState } from "react"
import { scaleTime, scaleLinear } from "d3-scale"
import { extent } from "d3-array"
import { area, curveMonotoneX } from "d3-shape"
import { select } from "d3-selection"
import "d3-transition"
import { interpolatePath } from "d3-interpolate-path"
import _ from "lodash"

import {
  useChartRefs,
  useDimensions,
  useInitUpdate,
  usePrevious,
} from "../../../../../hooks"
import {
  ChartWrapper,
  ChartSvg,
  ChartArea,
  AxisLine,
  Container,
} from "../../../../atoms"
import { transition, colors } from "../../../../../themes/theme"
import { makeTransition } from "../../../../../utils/chartHelpers"
import { createUpdateDelaunayCircles } from "../../../../../utils/svgElementHelpers"
import ChartTooltip from "../ChartTooltip/ChartTooltip"

const yDomain = {
  abs: [0, 850],
  perc: [0, 1],
}

const metricArray = ["waste", "recycling_total", "recycling_composting"]
const metricNames = ["Waste", "Material recycling", "Composting"]

export default function AreaChart(props) {
  const {
    data,
    margin,
    metric,
    value,
    withAxes,
    withLabel,
    handleMouseover,
    handleMouseout,
    hoveredYear,
  } = props
  const refs = useChartRefs()
  const storedValues = useRef()
  const prevHoveredYear = usePrevious(hoveredYear)
  const [delaunayData, setDelaunayData] = useState()
  const [hoveredData, setHoveredData] = useState(undefined)
  const dims = useDimensions({
    ref: refs.wrapperRef,
    margin,
  })

  function initVis() {
    const xScale = scaleTime()
      .domain(extent(data, d => d.year))
      .range([0.5, dims.chartWidth])
    const yScale = scaleLinear()
      .domain(yDomain[metric])
      .range([dims.chartHeight - 0.5, 0])
    const chartArea = select(refs.areaRef.current)
    storedValues.current = {
      yScale,
      xScale,
      chartArea,
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
    if (props.isHoverable) {
      createUpdateDelaunay()
    }
  }

  useEffect(() => {
    if (hoveredYear && !prevHoveredYear) {
      const { chartArea, yScale, xScale } = storedValues.current
      const hoveredData = delaunayData.filter(d => d.yearString === hoveredYear)
      const maxValue = _.maxBy(hoveredData, "metricValue").metricValue
      chartArea
        .append("line")
        .attr("class", "hover-line")
        .attr("stroke", colors.grayDarkest)
        .attr("pointer-events", "none")
        .attr("stroke-dasharray", "4, 1")
        .attr("x1", xScale(hoveredData[0].year))
        .attr("x2", xScale(hoveredData[0].year))
        .attr("y1", yScale(maxValue))
        .attr("y2", dims.chartHeight)
      chartArea
        .selectAll(".hover-circle")
        .data(hoveredData)
        .enter()
        .append("circle")
        .attr("class", "hover-circle")
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.metricValue))
        .attr("pointer-events", "none")
        .attr("r", 5)
        .attr("fill", "#fff")
        .attr("stroke", colors.grayDarkest)
      setHoveredData({ data: hoveredData, maxValue })
    }
    if (!hoveredYear && prevHoveredYear) {
      const { chartArea } = storedValues.current
      chartArea.selectAll(".hover-circle").remove()
      chartArea.selectAll(".hover-line").remove()
      setHoveredData(undefined)
    }
  }, [hoveredYear, prevHoveredYear, delaunayData, dims.chartHeight])

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
    if (props.isHoverable) {
      createUpdateDelaunay()
    }
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

  function createUpdateDelaunay() {
    const delaunayData = metricArray
      .map((metric, i) =>
        data.map(d => ({
          ...d,
          metricValue: d[metric],
          unit: metric + d.country,
          metric: metricNames[i],
        }))
      )
      .flat()
    createUpdateDelaunayCircles({
      data: delaunayData,
      dims,
      props: {
        xKey: "year",
        yKey: "metricValue",
        hoverRadius: 150,
        unitKey: "unit",
      },
      storedValues,
      functions: { handleMouseover, handleMouseout },
    })
    setDelaunayData(delaunayData)
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
      {props.isHoverable && (
        <ChartTooltip
          data={hoveredData}
          margin={margin}
          storedValues={storedValues}
          metric={metric}
        />
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
