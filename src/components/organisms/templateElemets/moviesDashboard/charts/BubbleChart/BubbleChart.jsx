import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled, { css } from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import _ from "lodash"
import { scaleTime, scaleLinear, scaleSqrt } from "d3-scale"
import { extent, mean } from "d3-array"
import useResizeAware from "react-resize-aware"
import { select } from "d3-selection"
import { useMeasure } from "react-use"
import gsap from "gsap"
import "d3-transition"

import { usePrevious } from "../../../../../../hooks"
import { COLORS } from "../../../../../../constants/moviesDashboard"
import { themifyFontSize } from "../../../../../../themes/mixins"
import { colors, fontSize, space } from "../../../../../../themes/theme"
import { useYDomainSyncUpdate, useRadiusUpdate } from "./hooks"
import { Delaunay } from "d3-delaunay"

const fadeOutEffect = css`
  content: "";
  position: absolute;
  z-index: 2;
  left: 0;
  pointer-events: none;
  width: 100%;
  height: 2.5rem;
`

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;

  :after {
    ${fadeOutEffect}
    bottom: 0;
    background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1) 95%
    );
  }

  :before {
    ${fadeOutEffect}
    top: 0px;
    background-image: linear-gradient(
      to top,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1) 95%
    );
  }
`

const ChartSvg = styled.svg`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;
`

const ChartTitle = styled(motion.div)`
  font-size: ${themifyFontSize(12)};
  line-height: 0.8;
  font-weight: 500;
  text-transform: uppercase;
  color: ${colors.grayDark};
  opacity: 0.1;
  position: absolute;
  left: 0px;
`

const NumberContainer = styled(motion.div)`
  font-size: ${themifyFontSize(6)};
  line-height: 1;
  font-weight: 500;
  text-transform: uppercase;
  color: ${colors.grayDark};
  opacity: 0.4;
  position: absolute;
  top: 35px;
  left: 0px;
`

const gridData = [0, 2, 4, 6, 8, 10]

export default function BubbleChart(props) {
  const { data, margin, type, xScale, sizeScale, yDomainSynced } = props
  const prevProps = usePrevious(props)
  const storedValues = useRef({ isInit: false })
  const chartAreaRef = useRef(null)
  const svgAreaRef = useRef(null)
  const gridAreaRef = useRef(null)
  const [ref, dims] = useMeasure()
  const prevDims = usePrevious(dims)

  const [ number, setNumber ] = useState(undefined)

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const currSizeScale = sizeScale.range(props.sizeRange)
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
      createUpdateVoronoi()
      setNumber(filteredData.length)
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
      .attr("r", ({ vote_count }) =>
        props.isSizeDynamic ? currSizeScale(vote_count) : mean(props.sizeRange)
      )
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
      .attr("x1", -margin.left)
      .attr("x2", dims.width)
      .attr("y1", d => yScale(d))
      .attr("y2", d => yScale(d))
      .attr("stroke", COLORS.gridColor)
      .attr("stroke-width", 0.25)
  }

  function createGridText() {
    const { yScale, gridArea } = storedValues.current
    gridArea
      .selectAll(`.grid-text-${props.chart}`)
      .data(gridData, d => d)
      .enter()
      .append("text")
      .attr("class", `grid-text-${props.chart}`)
      .attr("x", dims.width - margin.left)
      .attr("y", d => yScale(d))
      .attr("dy", d => (d < 5 ? -4 : 12))
      .attr("text-anchor", "end")
      .attr("font-size", fontSize[1])
      .attr("fill", COLORS.gridColor)
      .text(d => d)
  }

  function createUpdateVoronoi() {
    const { svgArea, yScale, currXScale, filteredData } = storedValues.current
    const setXPos = d => currXScale(new Date(d.release_date)) + margin.left
    const setYPos = d => yScale(d.vote_average) + margin.top
    const delaunay = Delaunay.from(filteredData, setXPos, setYPos).voronoi([
      0,
      0,
      dims.width,
      dims.height,
    ])

    console.log("createUpdateVoronoi -> filteredData", filteredData)
    svgArea
      .selectAll(".voronoi-path")
      .data(filteredData, d => d.id)
      .join(
        enter =>
          enter
            .append("path")
            .attr("class", "voronoi-path")
            .attr("fill", "transparent")
            // .attr("stroke", "#333")
            .attr("d", (_, i) => delaunay.renderCell(i))
            .on("mouseover", d => console.log(d))
            .call(enter => enter),
        update =>
          update.call(update =>
            update.transition().attr("d", (_, i) => delaunay.renderCell(i))
          )
      )
  }

  useYDomainSyncUpdate({ storedValues, props, prevProps, createUpdateVoronoi })
  useRadiusUpdate({ storedValues, props, prevProps })

  return (
    <Wrapper ref={ref}>
      <ChartTitle>{type}</ChartTitle>
      <NumberContainer>
        {number}
      </NumberContainer>
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
    top: 20,
    left: 10,
    bottom: 20,
    right: 20,
  },
  sizeRange: [2, 20],
}
