import React, { useEffect, useState, useRef } from "react"
import { max, min } from "d3-array"
import { forceSimulation, forceX, forceY, forceCollide } from "d3-force"
import chroma from "chroma-js"
import { select } from "d3-selection"
import { scaleLinear, scaleBand } from "d3-scale"
import { axisBottom } from "d3-axis"
import _ from "lodash"
import { FaQuestion } from "react-icons/fa"

import {
  ChartWrapper,
  ChartSvg,
  AxisLine,
  ChartArea,
  FlexContainer,
  Container,
} from "../../../../atoms"
import { useChartRefs, useDimensions, usePrevious } from "../../../../../hooks"
import {
  chartColors,
  lowOpacity,
  TEXT,
  CIRCLE_RADIUS,
} from "../../../../../constants/visualizations/coronavirusHungary"
import { makeTransition } from "../../../../../utils/chartHelpers"
import { transition, space, colors } from "../../../../../themes/theme"
import ChartTooltip from "../ChartTooltip/ChartTooltip"

export default function AgeChartBrowser({
  data,
  margin,
  language,
  isCombined,
}) {
  const { svgRef, wrapperRef, xAxisRef, areaRef } = useChartRefs()
  const dims = useDimensions({
    ref: wrapperRef,
    margin,
  })
  const [mouseoverValue, setMouseoverValue] = useState(undefined)
  const [firstHover, setFirstHover] = useState(false)
  const prevMouseoverValue = usePrevious(mouseoverValue)
  const [init, setInit] = useState(false)
  const storedValues = useRef()
  const lineRef = useRef()
  const prevData = usePrevious(data)
  const prevDims = usePrevious(dims)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setColor = ({ gender }) =>
    isCombined
      ? chartColors.total
      : gender === TEXT.genderM[language]
      ? chartColors.male
      : chartColors.female

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setFillOpaque = d => chroma(setColor(d)).alpha(lowOpacity)

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          .y(({ gender }) =>
            isCombined
              ? dims.chartHeight / 2
              : yScale(gender) + yScale.bandwidth() / 2
          )
      )
      .force("collide", forceCollide().radius(6))
      .tick(300)

    const updateStoredPos = g =>
      g
        .each(d => (isCombined ? (d.combinedY = d.y) : (d.genderY = d.y)))
        .each(d => (isCombined ? (d.combinedX = d.x) : (d.genderX = d.x)))

    area
      .selectAll(isCombined ? ".combined-circle" : ".gender-circle")
      .data(data, ({ number }) => number)
      .join(
        enter =>
          enter
            .append("circle")
            .attr("class", isCombined ? "combined-circle" : "gender-circle")
            .attr("r", 0)
            .attr("cx", ({ x }) => x)
            .attr("cy", ({ y }) => y)
            .attr("fill", setFillOpaque)
            .attr("stroke", setColor)
            .call(updateStoredPos)
            .on("mouseover", d => {
              !firstHover && setFirstHover(true)
              setMouseoverValue(d)
            })
            .on("mouseout", () => setMouseoverValue(undefined))
            .call(enter =>
              enter
                .transition(makeTransition(area, duration, "in"))
                .attr("r", CIRCLE_RADIUS)
            ),
        update =>
          update.call(update =>
            update
              .call(updateStoredPos)
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

  useEffect(() => {
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
        .call(g => g.selectAll(".tick text").attr("fill", colors.grayDarkest))
    }

    function updateDims() {
      const { yScale, xScale } = storedValues.current
      yScale.range([0, dims.chartHeight])
      xScale.range([0, dims.chartWidth])
      createUpdateCircles(0)
      createUpdateAxis()
      storedValues.current = { ...storedValues.current, yScale, xScale }
    }

    if (!init && data && dims.chartHeight) {
      const area = select(areaRef.current)
      const yScale = scaleBand()
        .range([0, dims.chartHeight])
        .domain([TEXT.accessorF[language], TEXT.genderM[language]])
      const xScale = scaleLinear()
        .range([0, dims.chartWidth])
        .domain([min(data, d => d.age) - 2, max(data, d => d.age) + 2])
      storedValues.current = { yScale, xScale, area }
      createUpdateCircles()
      createUpdateAxis(0)
      setInit(true)
    }

    if (init && data.length !== prevData.length) {
      createUpdateCircles()
    }
    if (init && !_.isEqual(prevDims, dims)) {
      updateDims()
    }
  }, [
    init,
    data,
    dims,
    prevData,
    prevDims,
    areaRef,
    xAxisRef,
    setFillOpaque,
    firstHover,
    setColor,
    language,
    createUpdateCircles,
    isCombined,
  ])

  useEffect(() => {
    if (!mouseoverValue && prevMouseoverValue) {
      storedValues.current.area
        .selectAll(isCombined ? ".combined-circle" : ".gender-circle")
        .transition(
          makeTransition(storedValues.current.area, transition.smNum, "hover")
        )
        .attr("fill", setFillOpaque)
        .attr("stroke", setColor)
    }
    if (mouseoverValue && !prevMouseoverValue) {
      storedValues.current.area
        .selectAll(isCombined ? ".combined-circle" : ".gender-circle")
        .transition(
          makeTransition(storedValues.current.area, transition.smNum, "hover")
        )
        .attr("fill", d =>
          d.number === mouseoverValue.number
            ? chroma(setColor(d)).brighten(2)
            : setFillOpaque(d)
        )
        .attr("stroke", d =>
          d.number === mouseoverValue.number
            ? chroma(setColor(d)).darken()
            : setColor(d)
        )
    }
  })

  useEffect(() => {
    if (init && prevData[0].gender !== data[0].gender) {
      const { yScale } = storedValues.current
      yScale.domain([TEXT.accessorF[language], TEXT.genderM[language]])
      storedValues.current = {
        ...storedValues.current,
        yScale,
      }
      createUpdateCircles()
    }
  })

  return (
    <ChartWrapper areaRef={wrapperRef}>
      <ChartTooltip
        width={dims.chartWidth}
        data={mouseoverValue}
        margin={margin}
        language={language}
        isCombined={isCombined}
      />
      {!firstHover && (
        <FlexContainer
          absPos
          left={0}
          width="240px"
          top={isCombined ? 10 : dims.chartHeight / 2}
          fontSize={2}
          textAlign="left"
        >
          <Container paddingTop={1} paddingRight={2}>
            <FaQuestion />
          </Container>
          {TEXT.hoverText[language]}
        </FlexContainer>
      )}
      <FlexContainer absPos bottom={6} left={0}>
        {TEXT.tooltipAge[language]}
      </FlexContainer>
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
  margin: { top: 35, right: 0, bottom: 25, left: 0 },
}
