import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled, { css } from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import _ from "lodash"
import { select } from "d3-selection"
import { useMeasure } from "react-use"
import "d3-transition"
import { axisBottom } from "d3-axis"
import { Delaunay } from "d3-delaunay"

import { COLORS, SIZE_RANGE } from "../../../../../../constants/moviesDashboard"
import { fontSize } from "../../../../../../themes/theme"
import { usePrevious } from "../../../../../../hooks"
import { makeTransition } from "../../../../../../utils/chartHelpers"

const fadeOutEffect = css`
  content: "";
  position: absolute;
  z-index: 2;
  left: 0;
  pointer-events: none;
  width: 100%;
  height: 1.5rem;
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

  .voronoi-path {
    cursor: pointer;
  }
`

export default function DateAxis(props) {
  const { margin, xScale, crewData, castData, activeMovieID } = props
  const prevProps = usePrevious(props)
  const storedValues = useRef({ isInit: false })
  const chartAreaRef = useRef(null)
  const svgAreaRef = useRef(null)
  const voronoiRef = useRef(null)
  const [ref, dims] = useMeasure()
  const radiusAdjust = SIZE_RANGE[0]

  useEffect(() => {
    if (!storedValues.current.isInit && dims.width) {
      const filteredData = _.uniqBy([...crewData, ...castData], "id")
        .filter(d => !!d.release_date && !!d.vote_count)
        .sort((a, b) => b.vote_count - a.vote_count)
      const currXScale = xScale.range([
        0,
        dims.width - margin.left - margin.right,
      ])
      const chartArea = select(chartAreaRef.current)
      const svgArea = select(svgAreaRef.current)
      storedValues.current = {
        isInit: true,
        currXScale,
        filteredData,
        chartArea,
        svgArea,
      }
      createDateAxis()
      createUpdateVoronoi()
      createRefElements()
    }
  })

  function createDateAxis() {
    const { currXScale, chartArea } = storedValues.current
    chartArea
      .call(
        axisBottom(currXScale)
          .ticks(dims.width / 80)
          .tickSize(0)
      )
      .call(g => {
        g.select(".domain").remove()
        g.selectAll("text")
          .attr("dy", 0)
          .attr("fill", COLORS.gridColor)
          .attr("font-size", fontSize[1])
      })
  }

  function createRefElements() {
    const { chartArea } = storedValues.current
    chartArea
      .append("circle")
      .attr("cy", 0)
      .attr("cx", 0)
      .attr("r", SIZE_RANGE[0] + radiusAdjust)
      .attr("fill", "#fff")
      .attr("stroke", chroma(COLORS.secondary).darken())
      .attr("stroke-width", 1)
      .attr("opacity", 0)
    chartArea
      .append("circle")
      .attr("cy", 0)
      .attr("cx", 0)
      .attr("r", SIZE_RANGE[0])
      .attr("fill", COLORS.secondary)
      .attr("stroke", chroma(COLORS.secondary).darken())
      .attr("stroke-width", 1)
      .attr("opacity", 0)
    chartArea
      .append("line")
      .attr("class", "top-line line")
      .attr("y1", -SIZE_RANGE[0] - radiusAdjust)
      .attr("y2", -dims.height / 2)
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("stroke", chroma(COLORS.secondary).darken())
      .attr("stroke-width", 1)
      .attr("opacity", 0)
    chartArea
      .append("line")
      .attr("class", "bottom-line line")
      .attr("y1", SIZE_RANGE[0] + radiusAdjust)
      .attr("y2", dims.height / 2)
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("stroke", chroma(COLORS.secondary).darken())
      .attr("stroke-width", 1)
      .attr("opacity", 0)
  }

  function createUpdateVoronoi() {
    const { currXScale, filteredData } = storedValues.current
    const setXPos = d => currXScale(new Date(d.release_date)) + margin.left
    const delaunay = Delaunay.from(
      filteredData,
      setXPos,
      () => dims.height / 2
    ).voronoi([0, 0, dims.width, dims.height])

    select(voronoiRef.current)
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
            // .on("mouseover", d => console.log(d))
            .on("click", d => props.setActiveMovieId(d.id))
            .call(enter => enter),
        update =>
          update.call(update =>
            update.transition().attr("d", (_, i) => delaunay.renderCell(i))
          )
      )
  }

  React.useEffect(() => {
    if (
      storedValues.current.isInit &&
      props.activeMovieID !== prevProps.activeMovieID
    ) {
      const { chartArea, filteredData, currXScale } = storedValues.current
      const t = makeTransition(chartArea, 500, "y-update")
      if (props.activeMovieID) {
        const selectedCircleData = filteredData.find(
          d => d.id === activeMovieID
        )
        chartArea
          .selectAll("circle")
          .datum(selectedCircleData)
          .transition(t)
          .attr("cx", ({ release_date }) => currXScale(new Date(release_date)))
          .attr("opacity", 1)
        const isCast = props.type === "cast"
        const mainData = isCast ? castData : crewData
        const subData = isCast ? crewData : castData
        const topLineData = mainData.filter(d => d.id === activeMovieID)
        const bottomLineData = subData.filter(d => d.id === activeMovieID)
        chartArea
          .selectAll(".line")
          .datum(selectedCircleData)
          .transition(t)
          .attr("x1", ({ release_date }) => currXScale(new Date(release_date)))
          .attr("x2", ({ release_date }) => currXScale(new Date(release_date)))
          .attr("opacity", 1)
        if (topLineData.length) {
          chartArea
            .selectAll(".top-line")
            .transition(t)
            .attr("y2", -dims.height / 2)
        } else {
          chartArea
            .selectAll(".top-line")
            .transition(t)
            .attr("y2", -SIZE_RANGE[0] - radiusAdjust)
        }
        if (bottomLineData.length) {
          chartArea
            .selectAll(".bottom-line")
            .transition(t)
            .attr("y2", dims.height / 2)
        } else {
          chartArea
            .selectAll(".bottom-line")
            .transition(t)
            .attr("y2", SIZE_RANGE[0] + radiusAdjust)
        }
      }
      if (!props.activeMovieID) {
        chartArea
          .selectAll(".circle")
          .transition(t)
          .attr("opacity", 0)
      }
    }
  })

  return (
    <Wrapper ref={ref}>
      <ChartSvg ref={svgAreaRef}>
        <g
          ref={chartAreaRef}
          style={{
            transform: `translate(${margin.left}px,${dims.height / 2}px)`,
          }}
        />
        <g ref={voronoiRef} />
      </ChartSvg>
    </Wrapper>
  )
}

DateAxis.defaultProps = {
  margin: {
    top: 20,
    left: 10,
    bottom: 20,
    right: 20,
  },
}
