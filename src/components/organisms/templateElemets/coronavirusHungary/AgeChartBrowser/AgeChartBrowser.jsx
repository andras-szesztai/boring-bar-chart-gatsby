import React, { useEffect, useState, useRef } from "react"
import { max, min } from "d3-array"
import chroma from "chroma-js"
import { select } from "d3-selection"
import { scaleLinear } from "d3-scale"
import { axisBottom } from "d3-axis"
import _ from "lodash"

import { ChartWrapper, ChartSvg, AxisLine, ChartArea } from "../../../../atoms"
import { useChartRefs, useDimensions, usePrevious } from "../../../../../hooks"
import {
  chartColors,
  lowOpacity,
} from "../../../../../constants/visualizations/coronavirusHungary"
import { makeTransition } from "../../../../../utils/chartHelpers"
import { transition, space, colors } from "../../../../../themes/theme"

export default function AgeChartBrowser({ data, margin }) {
  const { svgRef, wrapperRef, xAxisRef, areaRef } = useChartRefs()
  const dims = useDimensions({
    ref: wrapperRef,
    margin,
  })
  const [init, setInit] = useState(false)
  const storedValues = useRef()
  const lineRef = useRef()
  const prevData = usePrevious(data)
  const prevDims = usePrevious(dims)

  useEffect(() => {
    function createUpdateRectangles() {
      const { yScale, xScale, area } = storedValues.current

      const setColor = ({ gender }) =>
        gender === "Férfi" ? chartColors.male : chartColors.female

      area
        .selectAll("circle")
        .data(data, ({ number }) => number)
        .join(
          enter =>
            enter
              .append("circle")
              .attr("r", 6)
              .attr("cx", ({ age }) => xScale(age))
              .attr("cy", ({ rand }) => yScale(rand))
              .attr("fill", d => chroma(setColor(d)).alpha(lowOpacity))
              .attr("stroke", setColor),
          update =>
            update.call(update =>
              update
                .transition(makeTransition(area, transition.lgNum, "update"))
                .attr("cx", ({ age }) => xScale(age))
            )
        )

      select(lineRef.current).raise()
    }

    function createUpdateAxis() {
      const { xScale } = storedValues.current
      const xAxis = select(xAxisRef.current)
      xAxis
        .call(
          axisBottom(xScale)
            .ticks(dims.chartWidth / 80)
            .tickSizeOuter(0)
        )
        .call(g => g.select(".domain").remove())
      xAxis
          .append("text")
          .attr("x", 0)
          .attr("y", space[3])
          .attr("text-anchor", "start")
          .attr("fill", colors.grayDarkest)
          .text("Életkor")
    }

    function updateDims() {
      const { yScale, xScale, area } = storedValues.current
      yScale.range([0, dims.chartHeight])
      xScale.range([0, dims.chartWidth])
      area
        .selectAll("circle")
        .attr("cx", ({ age }) => xScale(age))
        .attr("cy", ({ rand }) => yScale(rand))
      storedValues.current = { ...storedValues.current, yScale, xScale }
    }

    if (!init && data) {
      const area = select(areaRef.current)
      const yScale = scaleLinear()
        .range([0, dims.chartHeight])
        .domain([200, 0])
      const xScale = scaleLinear()
        .range([0, dims.chartWidth])
        .domain([min(data, d => d.age) - 2, max(data, d => d.age) + 2])
      storedValues.current = { yScale, xScale, area }
      createUpdateRectangles()
      createUpdateAxis()
      setInit(true)
    }
    if (init && !_.isEqual(data, prevData)) {
    }
    if (init && !_.isEqual(prevDims, dims)) {
      updateDims()
    }
  }, [init, data, dims, prevData, prevDims, areaRef, xAxisRef])

  return (
    <ChartWrapper ref={wrapperRef}>
      <ChartSvg absPos ref={svgRef} width={dims.width} height={dims.height}>
        <ChartArea
          marginLeft={margin.left}
          marginTop={margin.top}
          ref={areaRef}
        />
        <ChartArea
          marginLeft={margin.left}
          marginTop={margin.top + dims.chartHeight}
          ref={xAxisRef}
        >
          <AxisLine
            color="grayDarkest"
            ref={lineRef}
            stroke={0.5}
            x2={dims.chartWidth}
          />
        </ChartArea>
      </ChartSvg>
    </ChartWrapper>
  )
}

AgeChartBrowser.defaultProps = {
  margin: { top: 20, right: 0, bottom: 25, left: 0 },
}
