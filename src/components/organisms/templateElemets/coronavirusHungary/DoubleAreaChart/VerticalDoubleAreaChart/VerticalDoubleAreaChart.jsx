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
import { space, colors } from "../../../../../../themes/theme"
import { area, curveCatmullRom } from "d3-shape"

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
  const leftGridArea = useRef()
  const dims = useDimensions({
    ref: wrapperRef,
    margin,
  })
  const [init, setInit] = useState(false)
  const prevData = usePrevious(data)
  const [areaDataSets, setAreaDataSets] = useState({})

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
        total: makeAreaData(data, fullList),
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
    if (!!prevData && !!data && !areaDataSets.total) {
      setDataSets()
      return
    }
    if (!!prevData && prevData.length !== data.length) {
      setDataSets()
    }
  }, [prevData, data, language, areaDataSets.total])

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
      const { xScale } = storedValues.current
      xScale.range([0, -(dims.width / 2 - space[5])])
      select(leftArea.current)
        .call(
          axisTop(xScale)
            .ticks((dims.width / 2 - space[5]) / 50)
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
          axisBottom(xScale)
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
    function createUpdateAreaLeft({ data, accessor, init }) {
      const { yScale, xScale } = storedValues.current
      const chartArea = select(leftArea.current)
      xScale.range([0, -(dims.width / 2 - space[5])])
      var areaGenerator = area()
        .y(({ age }) => yScale(age))
        .x1(({ number }) => xScale(number))
        .x0(xScale(0))
        .curve(curveCatmullRom)
      if (init) {
        chartArea
          .append("path")
          .datum(data)
          .attr("class", `${accessor}-path`)
          .attr("fill", chroma(chartColors[accessor]).alpha(lowOpacity))
          .attr("stroke", chartColors[accessor])
          .attr("d", areaGenerator)
      }
      select(yAxisRef.current).raise()
    }
    function createUpdateXAxisRight() {
      const { xScale } = storedValues.current
      xScale.range([0, dims.width / 2 - space[5]])
      select(rightArea.current)
        .call(
          axisTop(xScale)
            .ticks((dims.width / 2 - space[5]) / 50)
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
          axisBottom(xScale)
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
    function createUpdateAreaRight({ data, accessor, init }) {
      const { yScale, xScale } = storedValues.current
      const chartArea = select(rightArea.current)
      xScale.range([0, dims.width / 2 - space[4]])
      var areaGenerator = area()
        .y(({ age }) => yScale(age))
        .x1(({ number }) => xScale(number))
        .x0(xScale(0))
        .curve(curveCatmullRom)
      if (init) {
        chartArea
          .append("path")
          .datum(data)
          .attr("class", `${accessor}-path`)
          .attr("fill", chroma(chartColors[accessor]).alpha(lowOpacity))
          .attr("stroke", chartColors[accessor])
          .attr("d", areaGenerator)
      }
      select(yAxisRef.current).raise()
    }
    if (!init && areaDataSets.total) {
      const { fullDomain } = storedValues.current
      const yScale = scaleLinear()
        .range([0, dims.chartHeight])
        .domain(fullDomain)
      const xScale = scaleLinear().domain([
        0,
        max(areaDataSets.total, ({ number }) => number),
      ])
      storedValues.current = { ...storedValues.current, yScale, xScale }
      createUpdateAxisLabels()
      createUpdateXAxisRight()
      createUpdateXAxisLeft()
      createUpdateAreaLeft({
        data: areaDataSets.female,
        accessor: "female",
        init: true,
      })
      createUpdateAreaRight({
        data: areaDataSets.male,
        accessor: "male",
        init: true,
      })
      setInit(true)
    }
  }, [areaDataSets, data, dims, init, svgRef, yAxisRef])

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
          marginLeft={dims.width / 2 - space[3]}
          marginTop={margin.top}
        />
        <ChartArea
          areaRef={leftGridArea}
          marginLeft={dims.width / 2 - space[3]}
          marginTop={margin.top}
        />
        <ChartArea
          areaRef={rightArea}
          marginLeft={dims.width / 2 + space[3]}
          marginTop={margin.top}
        />
        <ChartArea
          areaRef={rightGridArea}
          marginLeft={dims.width / 2 + space[3]}
          marginTop={margin.top}
        />
      </ChartSvg>
    </ChartWrapper>
  )
}

VerticalDoubleAreaChart.defaultProps = {
  margin: { top: 25, right: 5, bottom: 10, left: 5 },
}
