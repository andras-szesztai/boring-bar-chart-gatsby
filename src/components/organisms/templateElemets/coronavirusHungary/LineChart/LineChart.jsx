import React, { useEffect, useState, useRef } from "react"

import { AxisLine, ChartArea, ChartWrapper, ChartSvg } from "../../../../atoms"
import { useChartRefs, useDimensions, usePrevious } from "../../../../../hooks"
import { scaleTime, scaleLinear } from "d3-scale"
import { extent } from "d3-array"
import { nest } from "d3-collection"
import { select } from "d3-selection"
import { line, curveMonotoneX } from "d3-shape"
import { chartColors } from "../../../../../constants/visualizations/coronavirusHungary"
import { space, colors } from "../../../../../themes/theme"
import { makeTransition } from "../../../../../utils/chartHelpers"
import { transition } from "../../../../../themes/theme"

const axisPadding = space[2]
export default function LineChart({ data, currDate, margin }) {
  const { svgRef, wrapperRef, yAxisRef, xAxisRef } = useChartRefs()
  const dims = useDimensions({
    ref: wrapperRef,
    margin,
  })
  const [init, setInit] = useState(false)
  const storedValues = useRef()
  const prevCurrDate = usePrevious(currDate)

  useEffect(() => {
    function createUpdateLines(currData) {
      const { yScale, xScale, area } = storedValues.current
      const dataSet = currData ? currData : data
      const lineGenerator = line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value))
        .curve(curveMonotoneX)
      const nestedData = nest()
        .key(({ key }) => key)
        .entries(dataSet)
      const className = currData ? "line" : "path-line"
      area
        .selectAll(`.${className}`)
        .data(nestedData)
        .join(enter =>
          enter
            .append("path")
            .attr("class", className)
            .attr("id", ({ key }) => (currData ? `${key}-line` : "line"))
            .attr("fill", "none")
            .attr("stroke", ({ key }) => (currData ? "none" : chartColors[key]))
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", d => lineGenerator(d.values))
        )
    }
    function createUpdateRefElements() {
      const { yScale, xScale, area } = storedValues.current
      const t = makeTransition(area, transition.lgNum, "update")
      const isLessDate = currDate < prevCurrDate
      const betweenData = data.filter(({ date }) =>
        isLessDate
          ? date >= currDate && date <= prevCurrDate
          : date >= prevCurrDate && date <= currDate
      )
      const currDateData = data.filter(({ date }) => date === currDate)
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
      createUpdateLines(betweenData)
      if(!init){
        area
          .selectAll("circle")
          .data(currDateData)
          .enter()
          .append("circle")
          .attr("id", ({key}) => `${key}-circle` )
          .attr("cx", )

      }

      area.selectAll(".path-line").remove()
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
      setInit(true)
    }
    if (init && prevCurrDate.toString() !== currDate.toString()) {
      createUpdateRefElements()
    }
  }, [init, data, dims, svgRef, yAxisRef, prevCurrDate, currDate])

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
