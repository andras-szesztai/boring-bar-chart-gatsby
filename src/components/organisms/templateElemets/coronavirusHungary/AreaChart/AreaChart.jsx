import React, { useState, useEffect, useRef } from "react"
import { select } from "d3-selection"
import { scaleLinear } from "d3-scale"
import { axisLeft, axisBottom, axisRight } from "d3-axis"
import chroma from "chroma-js"
import { area, curveCatmullRom } from "d3-shape"
import { interpolatePath } from "d3-interpolate-path"
import _ from "lodash"

import {
  ChartWrapper,
  ChartSvg,
  ChartArea,
  AxisLine,
  FlexContainer,
  Container,
} from "../../../../atoms"
import { useChartRefs, useDimensions, usePrevious } from "../../../../../hooks"
import { space, transition, colors } from "../../../../../themes/theme"
import { makeAreaData } from "../utils/dataHelpers"
import {
  lowOpacity,
  lowestOpacity,
  chartColors,
  TEXT,
} from "../../../../../constants/visualizations/coronavirusHungary"
import { makeTransition } from "../../../../../utils/chartHelpers"
import { max } from "d3-array"
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io"

export default function AreaChart({
  margin,
  data,
  language,
  fullListDomain,
  accessor,
  isCombined,
}) {
  const { svgRef, wrapperRef, areaRef, xAxisRef, yAxisRef } = useChartRefs()
  const storedValues = useRef()
  const dims = useDimensions({
    ref: wrapperRef,
    margin,
  })
  const [init, setInit] = useState(false)
  const prevData = usePrevious(data)
  const prevDims = usePrevious(dims)

  useEffect(() => {
    function createUpdateArea(duration = transition.lgNum) {
      const { yScale, xScale, chartArea } = storedValues.current
      const areaData = makeAreaData(data, fullListDomain.fullAgeList)
      var areaGenerator = area()
        .x(({ age }) => xScale(age))
        .y0(yScale(0))
        .y1(({ number }) => yScale(number))
        .curve(curveCatmullRom)
      if (!init) {
        chartArea
          .append("path")
          .datum(areaData)
          .attr("fill", chroma(chartColors[accessor]).alpha(lowOpacity))
          .attr("stroke", chartColors[accessor])
          .attr("d", areaGenerator)
      }
      if (init) {
        chartArea
          .select("path")
          .datum(areaData)
          .transition(makeTransition(chartArea, duration))
          .attrTween("d", (d, i, n) =>
            interpolatePath(select(n[i]).attr("d"), areaGenerator(d))
          )
      }
    }
    function createUpdateAxes() {
      const { yScale, xScale } = storedValues.current
      const formatAxis = (axis, removeFirstTick, opaqueTicks) =>
        axis.call(g => {
          g.select(".domain").remove()
          g.selectAll(".tick line")
            .attr("stroke", colors.grayDarkest)
            .attr("stroke-width", 0.5)
          if (!opaqueTicks) {
            g.selectAll(".tick text").attr("fill", colors.grayDarkest)
          }
          if (removeFirstTick) {
            g.select(".tick:last-of-type line").remove()
          }
          if (opaqueTicks) {
            g.selectAll(".tick line").attr("stroke-opacity", lowestOpacity)
            g.selectAll(".tick text").remove()
          }
        })
      select(yAxisRef.current).call(
        axisLeft(yScale)
          .ticks(dims.chartHeight / 50)
          .tickSizeInner(space[1])
          .tickSizeOuter(0)
      )
      formatAxis(select(yAxisRef.current), true)
      select(xAxisRef.current).call(
        axisBottom(xScale)
          .ticks(dims.chartWidth / 50)
          .tickSizeInner(space[1])
          .tickSizeOuter(0)
      )
      formatAxis(select(xAxisRef.current))
      select(areaRef.current).call(
        axisRight(yScale)
          .ticks(dims.chartHeight / 50)
          .tickSizeInner(dims.chartWidth)
          .tickSizeOuter(0)
      )
      formatAxis(select(areaRef.current), true, true)
    }
    if (!init && data && dims.height) {
      const xScale = scaleLinear()
        .range([0, dims.chartWidth])
        .domain(fullListDomain.fullAgeDomain)
      const yScale = scaleLinear()
        .range([isCombined ? space[4] : space[2], dims.chartHeight])
        .domain([
          isCombined
            ? max(
                makeAreaData(data, fullListDomain.fullAgeList).map(
                  ({ number }) => number
                )
              )
            : fullListDomain.maxNumber,
          0,
        ])
      const chartArea = select(areaRef.current)
      storedValues.current = {
        yScale,
        xScale,
        chartArea,
      }
      createUpdateAxes()
      createUpdateArea()
      setInit(true)
    }
    if (init && prevData.length !== data.length) {
      const { xScale, yScale } = storedValues.current
      storedValues.current = {
        ...storedValues.current,
        yScale,
        xScale,
      }
      createUpdateArea()
    }
    if (init && !_.isEqual(dims, prevDims)) {
      const { yScale, xScale } = storedValues.current
      xScale.range([0, dims.chartWidth])
      yScale.range([isCombined ? space[4] : space[2], dims.chartHeight])
      createUpdateAxes()
      createUpdateArea(0)
    }
  }, [
    init,
    data,
    prevData,
    fullListDomain,
    dims,
    areaRef,
    yAxisRef,
    xAxisRef,
    accessor,
    isCombined,
    prevDims,
  ])

  return (
    <ChartWrapper areaRef={wrapperRef}>
      <FlexContainer
        absPos
        top={margin.top - 4}
        left={margin.left + 2}
        direction="column"
        align="flex-start"
      >
        {TEXT.chartAxisNumber[language]}
        <Container style={{ transform: "translateY(-6px)" }} >
          <IoMdArrowDropdown />
        </Container>
      </FlexContainer>
      <FlexContainer absPos bottom={0} left={margin.left + 2}>
        {TEXT.tooltipAge[language]}{" "}
        <Container paddingTop={1}>
          <IoMdArrowDropright />
        </Container>
      </FlexContainer>
      <ChartSvg absPos areaRef={svgRef} width={dims.width} height={dims.height}>
        <ChartArea
          areaRef={areaRef}
          marginLeft={margin.left}
          marginTop={margin.top}
        />
        <ChartArea
          areaRef={yAxisRef}
          marginLeft={margin.left}
          marginTop={margin.top}
        >
          <AxisLine y1={0} y2={dims.chartHeight} x1={0} x2={0} stroke={0.5} />
        </ChartArea>
        <ChartArea
          areaRef={xAxisRef}
          marginLeft={margin.left}
          marginTop={margin.top + dims.chartHeight}
        >
          <AxisLine y1={0} y2={0} x1={0} x2={dims.chartWidth} stroke={0.5} />
          <rect
            x={0}
            width={dims.chartWidth}
            y={0}
            height={space[1]}
            fill="#FFF"
          />
        </ChartArea>
      </ChartSvg>
    </ChartWrapper>
  )
}

AreaChart.defaultProps = {
  margin: { top: 15, right: 10, bottom: 35, left: 25 },
}
