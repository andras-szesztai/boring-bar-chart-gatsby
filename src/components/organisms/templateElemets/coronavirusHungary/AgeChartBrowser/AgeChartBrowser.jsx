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
      const hoverT = makeTransition(area, transition.sm, "hover")

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
              .on("mouseover", (d, i, n) =>
                select(n[i])
                  .attr("fill", chroma(setColor(d)).brighten(2))
                  .attr("stroke", chroma(setColor(d)).darken())
              )
              .on("mouseout", (d, i, n) =>
                select(n[i])
                  .attr("fill", chroma(setColor(d)).alpha(lowOpacity))
                  .attr("stroke", setColor(d))
              )
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
      area.selectAll(".ref-line").raise()
      area.selectAll(".ref-group").raise()
    }

    function createUpdateRef({
      className,
      init,
      data,
      prevData,
      y1,
      y2,
      y,
      color,
    }) {
      const { xScale, area } = storedValues.current
      const t = makeTransition(area, transition.lgNum, "update")
      const getTween = (d, i, n) =>
        numberTween({
          value: data,
          prevValue: prevData,
          i,
          n,
          numberFormat: ".3n",
        })

      if (init) {
        area
          .append("line")
          .attr("class", `ref-line ref-${className}`)
          .attr("y1", y1)
          .attr("y2", y2)
          .attr("x1", xScale(data))
          .attr("x2", xScale(data))
          .attr("stroke", color)
        area.append("g").attr("class", `ref-group ref-group-${className}`)
        const refGroup = select(`.ref-group-${className}`)
        refGroup
          .append("rect")
          .attr("y", y - 8)
          .attr("width", 40)
          .attr("x", xScale(data) - 20)
          .attr("height", space[3])
          .attr("fill", "#fff")
          .attr("fill-opacity", 0.9)
        refGroup
          .append("text")
          .attr("y", y)
          .attr("dy", 5)
          .attr("x", xScale(data))
          .attr("text-anchor", "middle")
          .attr("fill", color)
          .text(data.toFixed(1))
        return
      }
      const refGroup = select(`.ref-group-${className}`)
      area
        .select(`.ref-${className}`)
        .transition(t)
        .attr("x1", xScale(data))
        .attr("x2", xScale(data))
      refGroup
        .select("text")
        .transition(t)
        .attr("x", xScale(data))
        .tween("text", (d, i, n) => getTween(d, i, n))
      refGroup
        .select("rect")
        .transition(t)
        .attr("x", xScale(data) - 20)
    }

    function moveRefs({ className, data, y1, y2, y }) {
      const { xScale, area } = storedValues.current
      const refGroup = select(`.ref-group-${className}`)
      area
        .select(`.ref-${className}`)
        .attr("x1", xScale(data))
        .attr("x2", xScale(data))
        .attr("y1", y1)
        .attr("y2", y2)
      refGroup
        .select("text")
        .attr("x", xScale(data))
        .attr("y", y)
      refGroup
        .select("rect")
        .attr("y", y - 8)
        .attr("x", xScale(data) - 20)
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
      createUpdateCircles(0)
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
      createUpdateAxis(0)
      createUpdateRef({
        className: "total",
        init: true,
        data: getMean(data),
        y1: dims.chartHeight,
        y2: 0,
        y: dims.chartHeight / 2,
        color: colors.grayDarkest,
      })
      createUpdateRef({
        className: "male",
        init: true,
        data: getMean(data.filter(({ gender }) => gender === "Férfi")),
        y1: dims.chartHeight / 2 + space[2],
        y2: dims.chartHeight,
        y: dims.chartHeight / 2 + dims.chartHeight / 4,
        color: chartColors.male,
      })
      createUpdateRef({
        className: "female",
        init: true,
        data: getMean(data.filter(({ gender }) => gender === "Nő")),
        y1: 0,
        y2: dims.chartHeight / 2 - space[2],
        y: dims.chartHeight / 4,
        color: chartColors.female,
      })
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
      createUpdateRef({
        className: "total",
        data: getMean(data),
        prevData: getMean(prevData),
      })
      createUpdateRef({
        className: "male",
        data: getMean(data.filter(({ gender }) => gender === "Férfi")),
        prevData: getMean(prevData.filter(({ gender }) => gender === "Férfi")),
      })
      createUpdateRef({
        className: "female",
        data: getMean(data.filter(({ gender }) => gender === "Nő")),
        prevData: getMean(prevData.filter(({ gender }) => gender === "Nő")),
      })
    }
    if (init && !_.isEqual(prevDims, dims)) {
      updateDims()
      moveRefs({
        className: "total",
        data: getMean(data),
        y1: dims.chartHeight,
        y2: 0,
        y: dims.chartHeight / 2,
      })
      moveRefs({
        className: "male",
        data: getMean(data.filter(({ gender }) => gender === "Férfi")),
        y1: dims.chartHeight / 2 + space[2],
        y2: dims.chartHeight,
        y: dims.chartHeight / 2 + dims.chartHeight / 4,
      })
      moveRefs({
        className: "female",
        data: getMean(data.filter(({ gender }) => gender === "Nő")),
        y1: 0,
        y2: dims.chartHeight / 2 - space[2],
        y: dims.chartHeight / 4,
      })
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
