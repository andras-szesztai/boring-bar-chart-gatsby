import React, { useState, useEffect, useRef } from "react"
import _ from "lodash"
import { select } from "d3-selection"
import { scaleLinear } from "d3-scale"
import { extent, max, min } from "d3-array"
import { axisLeft, axisTop, axisBottom } from "d3-axis"
import chroma from "chroma-js"

import {
  ChartWrapper,
  ChartSvg,
  ChartArea,
  AxisLine,
} from "../../../../../atoms"
import {
  useChartRefs,
  useDimensions,
  usePrevious,
} from "../../../../../../hooks"
import {
  TEXT,
  chartColors,
  lowestOpacity,
  lowOpacity,
} from "../../../../../../constants/visualizations/coronavirusHungary"
import { space, colors, transition } from "../../../../../../themes/theme"
import { area, curveCatmullRom } from "d3-shape"
import { interpolatePath } from "d3-interpolate-path"
import { makeTransition } from "../../../../../../utils/chartHelpers"

const makeAreaData = (data, fullList) => {
  const grouped = _.groupBy(data, "age")
  const newData = fullList.map(age => ({
    age: +age,
    number: grouped[age] ? grouped[age].length : 0,
  }))

  return newData
}

export default function VerticalDoubleAreaChart({ margin, data, language }) {
  const { svgRef, wrapperRef, yAxisRef } = useChartRefs()
  const storedValues = useRef()
  const leftArea = useRef()
  const rightArea = useRef()
  const rightGridArea = useRef()
  const leftAxisAreaBottom = useRef()
  const rightAxisAreaBottom = useRef()
  const leftGridArea = useRef()
  const dims = useDimensions({
    ref: wrapperRef,
    margin,
  })
  const [init, setInit] = useState(false)
  const prevData = usePrevious(data)
  const [areaDataSets, setAreaDataSets] = useState({})
  const prevAreaDataSets = usePrevious(areaDataSets)

  useEffect(() => {
    const setDataSets = () => {
      if (!storedValues.current) {
        const fullDomain = [
          min(data, ({ age }) => age) - 2,
          max(data, ({ age }) => age) + 2,
        ]
        const fullList = []
        for (var i = fullDomain[0]; i <= fullDomain[1]; i++) {
          fullList.push(i)
        }
        storedValues.current = { fullList, fullDomain }
      }
      const { fullList } = storedValues.current
      setAreaDataSets({
        female: makeAreaData(
          data.filter(({ gender }) => gender === TEXT.accessorF[language]),
          fullList
        ),
        male: makeAreaData(
          data.filter(({ gender }) => gender === TEXT.accessorM[language]),
          fullList
        ),
      })
    }
    if (!!prevData && !!data && !areaDataSets.female) {
      setDataSets()
      return
    }
    if (!!prevData && prevData.length !== data.length) {
      setDataSets()
    }
  }, [prevData, data, language, areaDataSets])

  useEffect(() => {
    function createUpdateAxisLabels() {
      const { yScale } = storedValues.current
      select(yAxisRef.current)
        .call(
          axisLeft(yScale)
            .ticks(dims.chartHeight / 50)
            .tickSize(0)
        )
        .call(g => g.select(".domain").remove())
        .call(g =>
          g
            .selectAll(".tick text")
            .attr("fill", colors.grayDarkest)
            .attr("text-anchor", "middle")
            .attr("dx", 3)
        )
        .call(g => g.selectAll(".tick line").remove())
    }
    function createUpdateXAxisLeft() {
      const { xScaleLeft, xRangeMax } = storedValues.current
      select(leftArea.current)
        .call(
          axisTop(xScaleLeft)
            .ticks(xRangeMax / 50)
            .tickSizeInner(space[1])
            .tickSizeOuter(0)
        )
        .call(g => g.select(".tick line").remove())
        .call(g => g.select(".tick text").remove())
        .call(g =>
          g
            .select(".domain")
            .attr("stroke", colors.grayDarkest)
            .attr("stroke-width", 0.5)
        )
        .call(g => g.selectAll(".tick text").attr("fill", colors.grayDarkest))
        .call(g =>
          g
            .selectAll(".tick line")
            .attr("stroke", colors.grayDarkest)
            .attr("stroke-width", 0.5)
        )

      select(leftAxisAreaBottom.current)
        .call(
          axisBottom(xScaleLeft)
            .ticks(xRangeMax / 50)
            .tickSizeInner(space[1])
            .tickSizeOuter(0)
        )
        .call(g => g.select(".tick line").remove())
        .call(g => g.select(".tick text").remove())
        .call(g =>
          g
            .select(".domain")
            .attr("stroke", colors.grayDarkest)
            .attr("stroke-width", 0.5)
        )
        .call(g => g.selectAll(".tick text").attr("fill", colors.grayDarkest))
        .call(g =>
          g
            .selectAll(".tick line")
            .attr("stroke", colors.grayDarkest)
            .attr("stroke-width", 0.5)
        )

      select(leftGridArea.current)
        .call(
          axisBottom(xScaleLeft)
            .ticks((dims.width / 2 - space[5]) / 50)
            .tickSizeInner(dims.chartHeight)
            .tickSizeOuter(0)
        )
        .call(g =>
          g
            .selectAll(".tick line")
            .attr("stroke", chroma(colors.grayDarkest).alpha(lowestOpacity))
            .attr("stroke-width", 0.5)
        )
        .call(g => g.selectAll(".tick text").remove())
        .call(g => g.select(".domain").remove())
    }
    function createUpdateAreaLeft({ data, accessor, isInit }) {
      const { yScale, xScaleLeft } = storedValues.current
      const chartArea = select(leftArea.current)
      var areaGenerator = area()
        .y(({ age }) => yScale(age))
        .x1(({ number }) => xScaleLeft(number))
        .x0(xScaleLeft(0))
        .curve(curveCatmullRom)
      if (isInit) {
        chartArea
          .append("path")
          .datum(data)
          .attr("class", `${accessor}-path`)
          .attr("fill", chroma(chartColors[accessor]).alpha(lowOpacity))
          .attr("stroke", chartColors[accessor])
          .attr("d", areaGenerator)
      }
      if (!isInit) {
        chartArea
          .select(`.${accessor}-path`)
          .datum(data)
          .transition(makeTransition(chartArea, transition.lgNum))
          .attrTween("d", (d, i, n) =>
            interpolatePath(select(n[i]).attr("d"), areaGenerator(d))
          )
      }
      select(yAxisRef.current).raise()
    }
    function createUpdateXAxisRight() {
      const { xScaleRight, xRangeMax } = storedValues.current
      select(rightArea.current)
        .call(
          axisTop(xScaleRight)
            .ticks(xRangeMax / 50)
            .tickSizeInner(space[1])
            .tickSizeOuter(0)
        )
        .call(g => g.select(".tick line").remove())
        .call(g => g.select(".tick text").remove())
        .call(g =>
          g
            .select(".domain")
            .attr("stroke", colors.grayDarkest)
            .attr("stroke-width", 0.5)
        )
        .call(g => g.selectAll(".tick text").attr("fill", colors.grayDarkest))
        .call(g =>
          g
            .selectAll(".tick line")
            .attr("stroke", colors.grayDarkest)
            .attr("stroke-width", 0.5)
        )

      select(rightAxisAreaBottom.current)
        .call(
          axisBottom(xScaleRight)
            .ticks(xRangeMax / 50)
            .tickSizeInner(space[1])
            .tickSizeOuter(0)
        )
        .call(g => g.select(".tick line").remove())
        .call(g => g.select(".tick text").remove())
        .call(g =>
          g
            .select(".domain")
            .attr("stroke", colors.grayDarkest)
            .attr("stroke-width", 0.5)
        )
        .call(g => g.selectAll(".tick text").attr("fill", colors.grayDarkest))
        .call(g =>
          g
            .selectAll(".tick line")
            .attr("stroke", colors.grayDarkest)
            .attr("stroke-width", 0.5)
        )

      select(rightGridArea.current)
        .call(
          axisBottom(xScaleRight)
            .ticks((dims.width / 2 - space[5]) / 50)
            .tickSizeInner(dims.chartHeight)
            .tickSizeOuter(0)
        )
        .call(g =>
          g
            .selectAll(".tick line")
            .attr("stroke", chroma(colors.grayDarkest).alpha(lowestOpacity))
            .attr("stroke-width", 0.5)
        )
        .call(g => g.selectAll(".tick text").remove())
        .call(g => g.select(".domain").remove())
    }

    function createUpdateAreaRight({ data, accessor, isInit }) {
      const { yScale, xScaleRight } = storedValues.current
      const chartArea = select(rightArea.current)
      var areaGenerator = area()
        .y(({ age }) => yScale(age))
        .x1(({ number }) => xScaleRight(number))
        .x0(xScaleRight(0))
        .curve(curveCatmullRom)
      if (isInit) {
        chartArea
          .append("path")
          .datum(data)
          .attr("class", `${accessor}-path`)
          .attr("fill", chroma(chartColors[accessor]).alpha(lowOpacity))
          .attr("stroke", chartColors[accessor])
          .attr("d", areaGenerator)
      }
      if (!isInit) {
        chartArea
          .select(`.${accessor}-path`)
          .datum(data)
          .transition(makeTransition(chartArea, transition.lgNum))
          .attrTween("d", (d, i, n) =>
            interpolatePath(select(n[i]).attr("d"), areaGenerator(d))
          )
      }
      select(yAxisRef.current).raise()
    }

    if (!init && areaDataSets.female) {
      const { fullDomain } = storedValues.current
      const xDomain = [
        0,
        max(
          [...areaDataSets.female, ...areaDataSets.male],
          ({ number }) => number
        ),
      ]
      const xRangeMax = dims.width / 2 - space[5]
      const yScale = scaleLinear()
        .range([0, dims.chartHeight])
        .domain(fullDomain)
      const xScaleLeft = scaleLinear()
        .domain(xDomain)
        .range([0, -xRangeMax])
      const xScaleRight = scaleLinear()
        .domain(xDomain)
        .range([0, xRangeMax])
      storedValues.current = {
        ...storedValues.current,
        yScale,
        xScaleLeft,
        xScaleRight,
        xRangeMax,
      }
      createUpdateAxisLabels()
      createUpdateXAxisRight()
      createUpdateXAxisLeft()
      createUpdateAreaLeft({
        data: areaDataSets.female,
        accessor: "female",
        isInit: true,
      })
      createUpdateAreaRight({
        data: areaDataSets.male,
        accessor: "male",
        isInit: true,
      })
      setInit(true)
    }

    if (
      init &&
      prevAreaDataSets &&
      prevAreaDataSets.female &&
      _.sumBy(areaDataSets.female, "number") !==
        _.sumBy(prevAreaDataSets.female, "number")
    ) {
      createUpdateAreaLeft({
        data: areaDataSets.female,
        accessor: "female",
      })
      createUpdateAreaRight({
        data: areaDataSets.male,
        accessor: "male",
      })
    }
  }, [areaDataSets, data, dims, init, prevAreaDataSets, svgRef, yAxisRef])

  const leftLeft = dims.width / 2 - space[3]
  const rightLeft = dims.width / 2 + space[3]
  return (
    <ChartWrapper areaRef={wrapperRef}>
      <ChartSvg absPos areaRef={svgRef} width={dims.width} height={dims.height}>
        <ChartArea
          areaRef={yAxisRef}
          marginLeft={dims.width / 2}
          marginTop={margin.top}
        >
          <rect
            x={0 - space[3]}
            width={2 * space[3]}
            y={0}
            height={dims.chartHeight}
            fill="#FFF"
          />
          <AxisLine
            y1={0}
            y2={dims.chartHeight}
            x1={0 - space[3]}
            x2={0 - space[3]}
            stroke={0.5}
          />
          <AxisLine
            y1={0}
            y2={dims.chartHeight}
            x1={0 + space[3]}
            x2={0 + space[3]}
            stroke={0.5}
          />
        </ChartArea>
        <ChartArea
          areaRef={leftArea}
          marginLeft={leftLeft}
          marginTop={margin.top}
        />
        <ChartArea
          areaRef={leftGridArea}
          marginLeft={leftLeft}
          marginTop={margin.top}
        />
        <ChartArea
          areaRef={leftAxisAreaBottom}
          marginLeft={leftLeft}
          marginTop={margin.top + dims.chartHeight}
        />
        <ChartArea
          areaRef={rightArea}
          marginLeft={rightLeft}
          marginTop={margin.top}
        />
        <ChartArea
          areaRef={rightGridArea}
          marginLeft={rightLeft}
          marginTop={margin.top}
        />
        <ChartArea
          areaRef={rightAxisAreaBottom}
          marginLeft={rightLeft}
          marginTop={margin.top + dims.chartHeight}
        />
      </ChartSvg>
    </ChartWrapper>
  )
}

VerticalDoubleAreaChart.defaultProps = {
  margin: { top: 25, right: 5, bottom: 25, left: 5 },
}
