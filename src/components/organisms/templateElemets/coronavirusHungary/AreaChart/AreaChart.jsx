import React, { useState, useEffect, useRef } from "react"
import { select } from "d3-selection"
import { scaleLinear } from "d3-scale"
import { axisLeft, axisBottom, axisRight } from "d3-axis"
import chroma from "chroma-js"

import { ChartWrapper, ChartSvg, ChartArea, AxisLine } from "../../../../atoms"
import { useChartRefs, useDimensions, usePrevious } from "../../../../../hooks"
import { space, transition, colors } from "../../../../../themes/theme"
import { makeAreaData } from "../utils/dataHelpers"
import { area, curveCatmullRom } from "d3-shape"
import {
  lowOpacity,
  lowestOpacity,
} from "../../../../../constants/visualizations/coronavirusHungary"
import { makeTransition } from "../../../../../utils/chartHelpers"
import { interpolatePath } from "d3-interpolate-path"

export default function AreaChart({
  margin,
  data,
  language,
  averages,
  fullListDomain,
  color,
}) {
  const { svgRef, wrapperRef, areaRef, xAxisRef, yAxisRef } = useChartRefs()
  const storedValues = useRef()
  const dims = useDimensions({
    ref: wrapperRef,
    margin,
  })
  const [init, setInit] = useState(false)
  const prevData = usePrevious(data)
  const prevAverages = usePrevious(averages)
  const [areaDataSets, setAreaDataSets] = useState({})
  const prevAreaDataSets = usePrevious(areaDataSets)

  useEffect(() => {
    function createUpdateArea() {
      const { yScale, xScale } = storedValues.current
      const areaData = makeAreaData(data, fullListDomain.fullAgeList)
      const chartArea = select(areaRef.current)
      var areaGenerator = area()
        .x(({ age }) => xScale(age))
        .y0(yScale(0))
        .y1(({ number }) => yScale(number))
        .curve(curveCatmullRom)
      if (!init) {
        chartArea
          .append("path")
          .datum(areaData)
          .attr("fill", chroma(color).alpha(lowOpacity))
          .attr("stroke", color)
          .attr("d", areaGenerator)
      }
      if (init) {
        chartArea
          .select("path")
          .datum(areaData)
          .transition(makeTransition(chartArea, transition.lgNum))
          .attrTween("d", (d, i, n) =>
            interpolatePath(select(n[i]).attr("d"), areaGenerator(d))
          )
      }
    }
    function createAxes() {
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
    if (!init && data) {
      const xScale = scaleLinear()
        .range([0, dims.chartWidth])
        .domain(fullListDomain.fullAgeDomain)
      const yScale = scaleLinear()
        .range([0, dims.chartHeight])
        .domain([fullListDomain.maxNumber, 0])
      storedValues.current = {
        yScale,
        xScale,
      }
      createUpdateArea()
      createAxes()
      setInit(true)
    }
    if (init && prevData.length !== data.length) {
      const { xScale, yScale } = storedValues.current
      storedValues.current = {
        yScale,
        xScale,
      }
      createUpdateArea()
    }
  }, [
    init,
    data,
    prevData,
    fullListDomain,
    dims,
    areaRef,
    color,
    yAxisRef,
    xAxisRef,
  ])

  useEffect(() => {})

  return (
    <ChartWrapper areaRef={wrapperRef}>
      {/* <FlexContainer
        absPos
        left={dims.width / 2 - (language === "hu" ? 50 : 54)}
        top={-space[3]}
        fontSize={2}
        direction="column"
        zIndex="hoverOverlay"
      >
        <FlexContainer>
          <Container paddingTop={1}>
            <IoMdArrowDropleft />
          </Container>
          {TEXT.chartAxisNumber[language]}
          <Container paddingTop={1}>
            <IoMdArrowDropright />
          </Container>
        </FlexContainer>
        <FlexContainer direction="column">
          {TEXT.tooltipAge[language]}
          <IoMdArrowDropdown />
        </FlexContainer>
      </FlexContainer> */}
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
  margin: { top: 5, right: 10, bottom: 25, left: 25 },
}
