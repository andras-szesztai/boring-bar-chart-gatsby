import React, { useState, useEffect, useRef } from "react"
import { select } from "d3-selection"
import { scaleLinear } from "d3-scale"
import { axisLeft, axisBottom, axisRight } from "d3-axis"
import chroma from "chroma-js"
import { area, curveCatmullRom } from "d3-shape"
import { interpolatePath } from "d3-interpolate-path"

import {
  ChartWrapper,
  ChartSvg,
  ChartArea,
  AxisLine,
  FlexContainer,
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
import { makeTransition, numberTween } from "../../../../../utils/chartHelpers"

export default function AreaChart({
  margin,
  data,
  language,
  averages,
  fullListDomain,
  accessor,
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

  useEffect(() => {
    function createUpdateArea() {
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
          .transition(makeTransition(chartArea, transition.lgNum))
          .attrTween("d", (d, i, n) =>
            interpolatePath(select(n[i]).attr("d"), areaGenerator(d))
          )
      }
    }
    function createUpdateAvgLine({ num, prevNum, currAccessor, textAnchor }) {
      const { xScale, chartArea } = storedValues.current
      const t = makeTransition(chartArea, transition.lgNum, "update")
      const setX = xScale(num)
      const getTween = (d, i, n) =>
        numberTween({
          value: +num,
          prevValue: +prevNum,
          i,
          n,
          numberFormat: ".3n",
        })
      if (!init) {
        chartArea
          .append("line")
          .attr("class", `ref-line ref-${currAccessor}`)
          .attr("y1", dims.chartHeight)
          .attr("y2", 0)
          .attr("x1", setX)
          .attr("x2", setX)
          .attr("stroke", chartColors[currAccessor])
        chartArea
          .append("text")
          .attr("class", `ref-text-${currAccessor}`)
          .attr("y", 0)
          .attr("dy", space[2] + 4)
          .attr("x", setX)
          .attr("dx", textAnchor === "start" ? space[1] : -space[1])
          .attr("text-anchor", textAnchor)
          .attr("fill", chartColors[currAccessor])
          .text(num.toFixed(1))
        return
      }
      chartArea
        .select(`.ref-${currAccessor}`)
        .transition(t)
        .attr("x1", setX)
        .attr("x2", setX)
      chartArea
        .select(`.ref-text-${currAccessor}`)
        .transition(t)
        .attr("x", setX)
        .attr("text-anchor", textAnchor)
        .attr("dx", textAnchor === "start" ? space[1] : -space[1])
        .tween("text", getTween)
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
    if (!init && data && dims.height) {
      const xScale = scaleLinear()
        .range([0, dims.chartWidth])
        .domain(fullListDomain.fullAgeDomain)
      const yScale = scaleLinear()
        .range([0, dims.chartHeight])
        .domain([fullListDomain.maxNumber, 0])
      const chartArea = select(areaRef.current)
      storedValues.current = {
        yScale,
        xScale,
        chartArea,
      }
      createAxes()
      createUpdateArea()
      createUpdateAvgLine({
        num: averages.total,
        currAccessor: "total",
        textAnchor: averages.total > averages[accessor] ? "start" : "end",
      })
      createUpdateAvgLine({
        num: averages[accessor],
        currAccessor: accessor,
        textAnchor: averages.total > averages[accessor] ? "end" : "start",
      })
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
      createUpdateAvgLine({
        num: averages.total,
        prevNum: prevAverages.total,
        currAccessor: "total",
        textAnchor: averages.total > averages[accessor] ? "start" : "end",
      })
      createUpdateAvgLine({
        num: averages[accessor],
        prevNum: prevAverages[accessor],
        currAccessor: accessor,
        textAnchor: averages.total > averages[accessor] ? "end" : "start",
      })
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
    averages,
    prevAverages,
  ])

  return (
    <ChartWrapper areaRef={wrapperRef}>
      <FlexContainer absPos top={3} left={margin.left + 1}>
        {TEXT.chartAxisNumber[language]}
      </FlexContainer>
      <FlexContainer absPos bottom={6} left={margin.left - 4}>
        {TEXT.tooltipAge[language]}
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
  margin: { top: 5, right: 10, bottom: 25, left: 25 },
}
