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
import { axisBottom } from "d3-axis"
import { COLORS, SIZE_RANGE } from "../../../../../../constants/moviesDashboard"
import { fontSize } from "../../../../../../themes/theme"
import { Delaunay } from "d3-delaunay"
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
`

export default function DateAxis(props) {
  const { margin, xScale, data, activeMovieID } = props
  const prevProps = usePrevious(props)
  const storedValues = useRef({ isInit: false })
  const chartAreaRef = useRef(null)
  const svgAreaRef = useRef(null)
  const voronoiRef = useRef(null)
  const [ref, dims] = useMeasure()

  useEffect(() => {
    if (!storedValues.current.isInit && dims.width) {
      const filteredData = _.uniqBy(data, "id")
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
      chartArea
        .append("circle")
        .attr("class", "inner-selected-circle circle")
        .attr("cy", 0)
        .attr("cx", 0)
        .attr("r", SIZE_RANGE[0])
        .attr("fill", COLORS.secondary)
        .attr("stroke", chroma(COLORS.secondary).darken())
        .attr("stroke-width", 1)
        .attr("opacity", 0)
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
        const selectedData = filteredData.find(d => d.id === activeMovieID)
        chartArea
          .selectAll(".circle")
          .datum(selectedData)
          .transition(t)
          .attr("cx", ({ release_date }) => currXScale(new Date(release_date)))
          .attr("opacity", 1)
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
