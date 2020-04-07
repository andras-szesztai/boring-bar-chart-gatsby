import React, { useEffect, useState, useRef } from "react"
import { max, min } from "d3-array"
import { forceSimulation, forceX, forceY, forceCollide } from "d3-force"
import chroma from "chroma-js"
import { select } from "d3-selection"
import { scaleLinear, scaleBand, scaleOrdinal } from "d3-scale"
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

  const setColor = ({ gender }) =>
    gender === "Férfi" ? chartColors.male : chartColors.female

  useEffect(() => {
    function createUpdateCircles() {
      const { yScale, xScale, area } = storedValues.current

      forceSimulation(data)
        .force(
          "forceX",
          forceX()
            .strength(1)
            .x(({ age }) => xScale(age))
        )
        .force(
          "forceY",
          forceY()
            .strength(0.1)
            .y(({ gender }) => yScale(gender) + yScale.bandwidth() / 2)
        )
        .force("collide", forceCollide().radius(6.5))
        .tick(300)

      area
        .selectAll("circle")
        .data(data, ({ number }) => number)
        .join(
          enter =>
            enter
              .append("circle")
              .attr("r", 0)
              .attr("cx", ({ x }) => x)
              .attr("cy", ({ y }) => y)
              .attr("fill", d => chroma(setColor(d)).alpha(lowOpacity))
              .attr("stroke", setColor)
              .call(enter =>
                enter
                  .transition(makeTransition(area, transition.lgNum, "in"))
                  .attr("r", 6)
              ),
          update => update.attr("cx", ({ x }) => x).attr("cy", ({ y }) => y),
          exit =>
          exit.call(exit =>
            exit
              .transition(makeTransition(area, transition.lgNum, "out"))
              .attr("r", 0)
              .remove()
          )
        )

      select(lineRef.current).raise()
    }

    function createUpdateAxis() {
      const { xScale } = storedValues.current
      select(xAxisRef.current)
        .call(
          axisBottom(xScale)
            .ticks(dims.chartWidth / 80)
            .tickSizeOuter(0)
            .tickSizeInner(space[1])
        )
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick text").attr("fill", colors.grayDarkest))
    }

    function updateDims() {
      const { yScale, xScale } = storedValues.current
      yScale.range([0, dims.chartHeight])
      xScale.range([0, dims.chartWidth])
      createUpdateCircles()
      createUpdateAxis()
      storedValues.current = { ...storedValues.current, yScale, xScale }
    }

    if (!init && data) {
      const area = select(areaRef.current)
      const yScale = scaleBand()
        .range([0, dims.chartHeight])
        .domain(["Nő", "Férfi"])
      const xScale = scaleLinear()
        .range([0, dims.chartWidth])
        .domain([min(data, d => d.age) - 2, max(data, d => d.age) + 2])
      storedValues.current = { yScale, xScale, area }
      createUpdateCircles()
      createUpdateAxis()
      select(xAxisRef.current)
        .append("text")
        .attr("x", 0)
        .attr("y", space[2] + 6)
        .attr("text-anchor", "start")
        .attr("fill", colors.grayDarkest)
        .text("Életkor")
      setInit(true)
    }

    if (init && data.length !== prevData.length) {
      createUpdateCircles()
    }
    if (init && !_.isEqual(prevDims, dims)) {
      updateDims()
    }
  }, [init, data, dims, prevData, prevDims, areaRef, xAxisRef])

  return (
    <ChartWrapper areaRef={wrapperRef}>
      <ChartSvg absPos areaRef={svgRef} width={dims.width} height={dims.height}>
        <ChartArea
          marginLeft={margin.left}
          marginTop={margin.top}
          areaRef={areaRef}
        />
        <ChartArea
          marginLeft={margin.left}
          marginTop={margin.top + dims.chartHeight}
          areaRef={xAxisRef}
        >
          <AxisLine
            color="grayDarkest"
            areaRef={lineRef}
            stroke={0.5}
            x2={dims.chartWidth}
          />
        </ChartArea>
      </ChartSvg>
    </ChartWrapper>
  )
}

AgeChartBrowser.defaultProps = {
  margin: { top: 15, right: 0, bottom: 25, left: 0 },
}
