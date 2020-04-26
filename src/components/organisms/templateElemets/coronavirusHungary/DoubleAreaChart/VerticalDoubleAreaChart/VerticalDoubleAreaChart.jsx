import React, { useState, useEffect, useRef } from "react"
import _ from "lodash"
import { select } from "d3-selection"
import { scaleLinear } from "d3-scale"
import { max } from "d3-array"
import { axisLeft, axisTop, axisBottom } from "d3-axis"
import chroma from "chroma-js"

import {
  ChartWrapper,
  ChartSvg,
  ChartArea,
  AxisLine,
  FlexContainer,
  Container,
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
import {
  makeTransition,
  numberTween,
} from "../../../../../../utils/chartHelpers"
import {
  IoMdArrowDropdown,
  IoMdArrowDropright,
  IoMdArrowDropleft,
  IoMdArrowDropup,
} from "react-icons/io"
import { makeAreaData } from "../../utils/dataHelpers"

const ticksDividerX = 75

export default function VerticalDoubleAreaChart({
  margin,
  data,
  language,
  fullListDomain,
}) {
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
  const leftLeft = dims.width / 2 - space[3]
  const rightLeft = dims.width / 2 + space[3]

  useEffect(() => {
    const setDataSets = () => {
      setAreaDataSets({
        female: makeAreaData(
          data.filter(({ gender }) => gender === TEXT.accessorF[language]),
          fullListDomain.fullAgeList
        ),
        male: makeAreaData(
          data.filter(({ gender }) => gender === TEXT.accessorM[language]),
          fullListDomain.fullAgeList
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
  }, [prevData, data, language, areaDataSets, fullListDomain])

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
            .ticks(xRangeMax / ticksDividerX)
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
            .ticks(xRangeMax / ticksDividerX)
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
            .ticks(xRangeMax / ticksDividerX)
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
            .ticks(xRangeMax / ticksDividerX)
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
            .ticks(xRangeMax / ticksDividerX)
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
            .ticks(xRangeMax / ticksDividerX)
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
        .domain(fullListDomain.fullAgeDomain)
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
  }, [areaDataSets, data, dims, fullListDomain, init, leftLeft, prevAreaDataSets, rightLeft, svgRef, yAxisRef])

  return (
    <ChartWrapper areaRef={wrapperRef}>
      <FlexContainer
        absPos
        left={dims.width / 2 - (language === "hu" ? 50 : 55)}
        top={-space[4]}
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
      </FlexContainer>
      <FlexContainer
        absPos
        left={dims.width / 2 - (language === "hu" ? 50 : 55)}
        bottom={-space[4]}
        fontSize={2}
        direction="column"
        zIndex="hoverOverlay"
      >
        <FlexContainer direction="column">
          <IoMdArrowDropup />
          {TEXT.tooltipAge[language]}
        </FlexContainer>
        <FlexContainer>
          <Container paddingTop={1}>
            <IoMdArrowDropleft />
          </Container>
          {TEXT.chartAxisNumber[language]}
          <Container paddingTop={1}>
            <IoMdArrowDropright />
          </Container>
        </FlexContainer>
      </FlexContainer>
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
