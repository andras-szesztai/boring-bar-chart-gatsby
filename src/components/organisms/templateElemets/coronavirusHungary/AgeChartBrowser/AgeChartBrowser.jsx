import React, { useEffect, useState, useRef } from "react"
import { max, min } from "d3-array"
import { forceSimulation, forceX, forceY, forceCollide } from "d3-force"
import chroma from "chroma-js"
import { select } from "d3-selection"
import { scaleLinear, scaleBand } from "d3-scale"
import { axisBottom } from "d3-axis"
import _ from "lodash"

import { ChartWrapper, ChartSvg, AxisLine, ChartArea } from "../../../../atoms"
import { useChartRefs, useDimensions, usePrevious } from "../../../../../hooks"
import {
  chartColors,
  lowOpacity,
} from "../../../../../constants/visualizations/coronavirusHungary"
import { makeTransition, numberTween } from "../../../../../utils/chartHelpers"
import { transition, space, colors } from "../../../../../themes/theme"

const getMean = array => _.meanBy(array, "age")
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
    function createUpdateCircles(duration = transition.lgNum) {
      const { yScale, xScale, area } = storedValues.current

      forceSimulation(data)
        .force(
          "forceX",
          forceX()
            .strength(0.85)
            .x(({ age }) => xScale(age))
        )
        .force(
          "forceY",
          forceY()
            .strength(0.15)
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
                  .transition(makeTransition(area, duration, "in"))
                  .attr("r", 6)
              ),
          update =>
            update.call(update =>
              update
                .transition(makeTransition(area, duration, "update"))
                .attr("cx", ({ x }) => x)
                .attr("cy", ({ y }) => y)
            ),
          exit =>
            exit.call(exit =>
              exit
                .transition(makeTransition(area, transition.mdNum, "out"))
                .attr("r", 0)
                .remove()
            )
        )

      select(lineRef.current).raise()
    }

    function createUpdateTotalRef(init) {
      const { xScale, area } = storedValues.current
      const meanTotal = getMean(data)
      const t = makeTransition(area, transition.lgNum, "update")
      const getTween = (d, i, n) =>
        numberTween({
          value: meanTotal,
          prevValue: getMean(prevData),
          i,
          n,
          numberFormat: ".3n",
        })

      if (init) {
        area
          .append("line")
          .attr("class", "ref-line ref-total")
          .attr("y1", 0)
          .attr("y2", dims.chartHeight)
          .attr("x1", xScale(meanTotal))
          .attr("x2", xScale(meanTotal))
          .attr("stroke", colors.grayDarkest)
        area.append("g").attr("class", "ref-group ref-group-total")
        const refGroup = select(".ref-group-total")
        refGroup
          .append("rect")
          .attr("y", dims.chartHeight / 2 - 9)
          .attr("width", 40)
          .attr("x", xScale(meanTotal) - 20)
          .attr("height", 20)
          .attr("fill", "#fff")
        refGroup
          .append("text")
          .attr("y", dims.chartHeight / 2)
          .attr("dy", 5)
          .attr("x", xScale(meanTotal))
          .attr("text-anchor", "middle")
          .text(meanTotal.toFixed(1))
        return
      }
      const refGroup = select(".ref-group-total")
      area
        .select(".ref-total")
        .transition(t)
        .attr("x1", xScale(meanTotal))
        .attr("x2", xScale(meanTotal))
      refGroup
        .select("text")
        .transition(t)
        .attr("x", xScale(meanTotal))
        .tween("text", (d, i, n) => getTween(d, i, n))
      refGroup
        .select("rect")
        .transition(t)
        .attr("x", xScale(meanTotal) - 20)
    }

    function createUpdateFemaleRef(init) {
      const { xScale, area } = storedValues.current
      const mean = getMean(data.filter(({ gender }) => gender === "Nő"))
      const t = makeTransition(area, transition.lgNum, "update")
      const getTween = (d, i, n) =>
        numberTween({
          value: mean,
          prevValue: getMean(prevData.filter(({ gender }) => gender === "Nő")),
          i,
          n,
          numberFormat: ".3n",
        })

      if (init) {
        area
          .append("line")
          .attr("class", "ref-line ref-female")
          .attr("y1", 0)
          .attr("y2", dims.chartHeight / 2)
          .attr("x1", xScale(mean))
          .attr("x2", xScale(mean))
          .attr("stroke", chartColors.female)
        area.append("g").attr("class", "ref-group ref-group-female")
        const refGroup = select(".ref-group-female")
        refGroup
          .append("rect")
          .attr("y", dims.chartHeight / 4 - 9)
          .attr("width", 40)
          .attr("x", xScale(mean) - 20)
          .attr("height", 20)
          .attr("fill", "#fff")
        refGroup
          .append("text")
          .attr("y", dims.chartHeight / 4)
          .attr("dy", 5)
          .attr("x", xScale(mean))
          .attr("text-anchor", "middle")
          .attr("fill", chartColors.female)
          .text(mean.toFixed(1))
        return
      }
      const refGroup = select(".ref-group-female")
      area
        .select(".ref-female")
        .transition(t)
        .attr("x1", xScale(mean))
        .attr("x2", xScale(mean))
      refGroup
        .select("text")
        .transition(t)
        .attr("x", xScale(mean))
        .tween("text", (d, i, n) => getTween(d, i, n))
      refGroup
        .select("rect")
        .transition(t)
        .attr("x", xScale(mean) - 20)
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
      const meanMale = getMean(data.filter(({ gender }) => gender === "Férfi"))
      createUpdateCircles()
      createUpdateAxis(0)
      createUpdateTotalRef(true)
      createUpdateFemaleRef(true)
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
      createUpdateTotalRef()
      createUpdateFemaleRef()
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
