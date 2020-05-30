import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import _ from "lodash"
import { scaleTime, scaleLinear, scaleSqrt } from "d3-scale"
import { extent } from "d3-array"
import useResizeAware from "react-resize-aware"
import { select } from "d3-selection"
import { useMeasure } from "react-use"
import gsap from "gsap"

import { usePrevious } from "../../../../../../hooks"
import { COLORS } from "../../../../../../constants/moviesDashboard"
import { themifyFontSize } from "../../../../../../themes/mixins"
import { colors } from "../../../../../../themes/theme"

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`

const ChartSvg = styled.svg`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;
`

const ChartTitle = styled(motion.text)`
  font-size: ${themifyFontSize(12)};
  line-height: 1;
  font-weight: 500;
  text-transform: uppercase;
  color: ${colors.grayDark};
  opacity: 0.1;
  position: absolute;
  top: 0px;
  left: 20px;
`

const gridData = [0, 2, 4, 6, 8, 10]

export default function BubbleChart(props) {
  const prevProps = usePrevious(props)
  const { data, margin, type, xScale, sizeScale, yDomainSynced } = props
  const storedValues = useRef({ isInit: false })
  const chartAreaRef = useRef(null)
  const svgAreaRef = useRef(null)
  const gridAreaRef = useRef(null)
  const [ref, dims] = useMeasure()
  const prevDims = usePrevious(dims)

  useEffect(() => {
    if (
      !storedValues.current.isInit &&
      prevDims &&
      !prevDims.width &&
      dims.width
    ) {
      const filteredData = data
        .filter(d => !!d.release_date && !!d.vote_count)
        .sort((a, b) => b.vote_count - a.vote_count)
      const currXScale = xScale.range([
        0,
        dims.width - margin.left - margin.right,
      ])
      const yScale = scaleLinear()
        .domain(
          yDomainSynced ? [0, 10] : extent(filteredData, d => d.vote_average)
        )
        .range([dims.height - margin.top - margin.bottom, 0])
      const currSizeScale = sizeScale.range([2, 20])
      const chartArea = select(chartAreaRef.current)
      const svgArea = select(svgAreaRef.current)
      const gridArea = select(gridAreaRef.current)
      storedValues.current = {
        isInit: true,
        currXScale,
        currSizeScale,
        yScale,
        chartArea,
        svgArea,
        gridArea,
        filteredData,
      }
      createGrid()
      createGridText()
      createCircles()
    }
  })

  function createCircles() {
    const {
      currXScale,
      currSizeScale,
      yScale,
      chartArea,
      filteredData,
    } = storedValues.current

    chartArea
      .selectAll(`.main-circle-${props.chart}`)
      .data(filteredData, d => d.id)
      .enter()
      .append("circle")
      .attr("class", `main-circle-${props.chart}`)
      .attr("cx", ({ release_date }) => currXScale(new Date(release_date)))
      .attr("cy", ({ vote_average }) => yScale(vote_average))
      .attr("r", ({ vote_count }) => currSizeScale(vote_count))
      .attr("fill", COLORS.secondary)
      .attr("stroke", chroma(COLORS.secondary).darken())
  }

  function createGrid() {
    const { yScale, gridArea } = storedValues.current
    gridArea
      .selectAll(`.grid-line-${props.chart}`)
      .data(gridData, d => d)
      .enter()
      .append("line")
      .attr("class", `grid-line-${props.chart}`)
      .attr("x1", 0)
      .attr("x2", dims.width - margin.left - margin.right)
      .attr("y1", d => yScale(d))
      .attr("y2", d => yScale(d))
      .attr("stroke", COLORS.gridColor)
      .attr("stroke-width", 0.5)
  }

  function createGridText() {
    const { yScale, gridArea } = storedValues.current
    const array = ["left", "right"]
    array.forEach(el => {
      const isLeft = el === "left"
      gridArea
        .selectAll(`.grid-text-${el}-${props.chart}`)
        .data(gridData, d => d)
        .enter()
        .append("text")
        .attr("class", `grid-text-${el}-${props.chart} grid-text`)
        .attr("x", isLeft ? -4 : dims.width - margin.left - margin.right + 4)
        .attr("y", d => yScale(d))
        .attr("dy", 2)
        .attr("text-anchor", isLeft ? "end" : "start")
        .text(d => d)
    })
  }

  // useYDomainSyncUpdate
  useEffect(() => {
    if (
      storedValues.current.isInit &&
      props.yDomainSynced !== prevProps.yDomainSynced
    ) {
      const { yScale, filteredData } = storedValues.current
      yScale.domain(
        yDomainSynced ? [0, 10] : extent(filteredData, d => d.vote_average)
      )
      gsap.to(`.main-circle-${props.chart}`, {
        y: (i, el) => {
          const prevY = select(el).attr("cy")
          const newY = yScale(select(el).datum().vote_average)
          return newY - prevY
        },
        ease: "power2.inOut",
      })
      gsap.to(`.grid-line-${props.chart}`, {
        y: (i, el) => {
          const prevY = select(el).attr("y1")
          const newY = yScale(select(el).datum())
          return newY - prevY
        },
        ease: "power2.inOut",
      })
      gsap.to(`.grid-text-left-${props.chart}`, {
        y: (i, el) => {
          const prevY = select(el).attr("y")
          const newY = yScale(select(el).datum())
          return newY - prevY
        },
        ease: "power2.inOut",
      })
      gsap.to(`.grid-text-right-${props.chart}`, {
        y: (i, el) => {
          const prevY = select(el).attr("y")
          const newY = yScale(select(el).datum())
          return newY - prevY
        },
        ease: "power2.inOut",
      })
      storedValues.current = {
        ...storedValues.current,
        yScale,
      }
    }
  }, [prevProps, props, yDomainSynced])

  return (
    <Wrapper ref={ref}>
      <ChartTitle>{type}</ChartTitle>
      <ChartSvg ref={svgAreaRef}>
        <g
          ref={gridAreaRef}
          style={{ transform: `translate(${margin.left}px,${margin.top}px)` }}
        />
        <g
          ref={chartAreaRef}
          style={{ transform: `translate(${margin.left}px,${margin.top}px)` }}
        />
      </ChartSvg>
    </Wrapper>
  )
}

BubbleChart.defaultProps = {
  margin: {
    top: 15,
    left: 15,
    bottom: 15,
    right: 15,
  },
}
