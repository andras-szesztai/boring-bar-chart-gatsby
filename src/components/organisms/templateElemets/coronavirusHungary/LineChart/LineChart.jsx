import React, { useEffect, useState, useRef } from "react"

import { AxisLine, ChartArea, ChartWrapper, ChartSvg } from "../../../../atoms"
import { useChartRefs, useDimensions, usePrevious } from "../../../../../hooks"
import { scaleTime, scaleLinear } from "d3-scale"
import { extent } from "d3-array"
import { nest } from "d3-collection"
import { select } from "d3-selection"
import { line, curveMonotoneX } from "d3-shape"

import {
  chartColors,
  CIRCLE_RADIUS,
} from "../../../../../constants/visualizations/coronavirusHungary"
import { space, colors } from "../../../../../themes/theme"
import { makeTransition } from "../../../../../utils/chartHelpers"
import { transition } from "../../../../../themes/theme"
import { axisLeft } from "d3-axis"

const axisPadding = space[2]
export default function LineChart({ data, currDate, margin, isPercentage }) {
  const { svgRef, wrapperRef, yAxisRef, xAxisRef } = useChartRefs()
  const dims = useDimensions({
    ref: wrapperRef,
    margin,
  })
  const [init, setInit] = useState(false)
  const storedValues = useRef()
  const prevCurrDate = usePrevious(currDate)

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
        .data(nestedData)
        .join(enter =>
          enter
            .append("path")
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", ({ key }) => chartColors[key])
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", d => lineGenerator(d.values))
        )
    }
    function createUpdateRefElements() {
      const { yScale, xScale, area } = storedValues.current
      const t = makeTransition(area, transition.lgNum, "update")
      const currDateData = data.filter(
        ({ date }) => date.toString() === currDate.toString()
      )
      area
        .selectAll(".ref-line")
        .data([currDate])
        .join(
          enter =>
            enter
              .append("line")
              .attr("class", "ref-line")
              .attr("stroke", colors.grayDarkest)
              .attr("stroke-width", 0.5)
              .attr("y1", 0)
              .attr("y2", dims.chartHeight)
              .attr("x1", xScale)
              .attr("x2", xScale),
          update =>
            update.call(update =>
              update
                .transition(t)
                .attr("x1", xScale)
                .attr("x2", xScale)
            )
        )
      area
        .selectAll("circle")
        .data(currDateData)
        .join(
          enter =>
            enter
              .append("circle")
              .attr("cx", ({ date }) => xScale(date))
              .attr("cy", ({ value }) => yScale(value))
              .attr("r", CIRCLE_RADIUS)
              .attr("fill", ({ key }) => chartColors[key])
              .attr("stroke", "#fff"),
          update =>
            update
              .attr("r", 0)
              .attr("cx", ({ date }) => xScale(date))
              .attr("cy", ({ value }) => yScale(value))
              .call(update =>
                update
                  .transition(t)
                  .delay(transition.lgNum)
                  .attr("r", CIRCLE_RADIUS)
              )
        )
    }
    if (!init && data && dims.chartHeight) {
      const xScale = scaleTime()
        .domain(extent(data, ({ date }) => date))
        .range([axisPadding, dims.chartWidth - axisPadding])
      const yScale = scaleLinear()
        .domain(extent(data, ({ value }) => value))
        .range([dims.chartHeight - axisPadding, axisPadding])
      const area = select(yAxisRef.current)
      storedValues.current = {
        yScale,
        xScale,
        area,
      }
      createUpdateLines()
      createUpdateRefElements()
      area.call(axisLeft(yScale).ticks(5, isPercentage ? ".0%" : "d")).call(g => {
        g.select(".domain").remove()
        g.selectAll(".tick line")
          .attr("stroke", colors.grayDarkest)
          .attr("stroke-width", 0.5)
      })
      setInit(true)
    }
    if (init && prevCurrDate.toString() !== currDate.toString()) {
      createUpdateRefElements()
    }
  }, [init, data, dims, svgRef, yAxisRef, prevCurrDate, currDate, isPercentage])

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
  margin: { top: 15, right: 10, bottom: 25, left: 30 },
}
