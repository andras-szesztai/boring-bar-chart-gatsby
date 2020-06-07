import React, { useState, useEffect, useRef } from "react"
import chroma from "chroma-js"
import { scaleLinear } from "d3-scale"
import { extent } from "d3-array"
import { select } from "d3-selection"
import { useMeasure } from "react-use"
import "d3-transition"
import { Delaunay } from "d3-delaunay"

import { usePrevious } from "../../../../../../hooks"
import {
  COLORS,
  SIZE_RANGE,
  CHART_SIDE_MARGINS,
  NO_HOVERED_MOVIE,
  TIMEOUT,
} from "../../../../../../constants/moviesDashboard"

import {
  useYDomainSyncUpdate,
  useRadiusUpdate,
  useActiveMovieIDUpdate,
  useHoveredUpdate,
  useChartResize,
} from "./hooks"
import { setRadius } from "./utils"
import { makeFilteredData } from "../../utils"
import { Wrapper, ChartTitle, NumberContainer, ChartSvg } from "./styles"
import { fontSize } from "../../../../../../themes/theme"

const gridData = [0, 2, 4, 6, 8, 10]

export default function BubbleChart(props) {
  const {
    data,
    margin,
    type,
    xScale,
    sizeScale,
    isYDomainSynced,
    isSizeDynamic,
    chart,
  } = props
  const prevProps = usePrevious(props)
  const storedValues = useRef({ isInit: false })
  const chartAreaRef = useRef(null)
  const voronoiRef = useRef(null)
  const svgAreaRef = useRef(null)
  const gridAreaRef = useRef(null)
  const [ref, dims] = useMeasure()
  const prevDims = usePrevious(dims)

  const [number, setNumber] = useState(undefined)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (
      !storedValues.current.isInit &&
      prevDims &&
      !prevDims.width &&
      dims.width
    ) {
      const filteredData = makeFilteredData(data)
      const currXScale = xScale.range([
        0,
        dims.width - margin.left - margin.right,
      ])
      const yScale = scaleLinear()
        .domain(
          isYDomainSynced ? [0, 10] : extent(filteredData, d => d.vote_average)
        )
        .range([dims.height - margin.top - margin.bottom, 0])
      const currSizeScale = sizeScale.range(props.sizeRange)
      const chartArea = select(chartAreaRef.current)
      const svgArea = select(svgAreaRef.current)
      const gridArea = select(gridAreaRef.current)
      const voronoiArea = select(voronoiRef.current)
      storedValues.current = {
        isInit: true,
        currXScale,
        currSizeScale,
        yScale,
        chartArea,
        svgArea,
        gridArea,
        voronoiArea,
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
      .selectAll(".main-circle")
      .data(filteredData, d => d.id)
      .enter()
      .append("g")
      .attr("class", "main-circle")

    chartArea
      .selectAll(".main-circle")
      .append("circle")
      .attr("class", "circle")
      .attr("cx", ({ release_date }) => currXScale(new Date(release_date)))
      .attr("cy", ({ vote_average }) => yScale(vote_average))
      .attr("r", d => setRadius({ props, currSizeScale, isSizeDynamic })(d))
      .attr("fill", COLORS.secondary)
      .attr("stroke", chroma(COLORS.secondary).darken())
      .attr("stroke-width", 1)
  }

  function createGrid() {
    storedValues.current.gridArea
      .selectAll(".grid-line")
      .data(gridData, d => d)
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", -margin.left)
      .attr("x2", dims.width)
      .attr("y1", d => storedValues.current.yScale(d))
      .attr("y2", d => storedValues.current.yScale(d))
      .attr("stroke", COLORS.gridColor)
      .attr("stroke-width", 0.25)
  }

  function createGridText() {
    storedValues.current.gridArea
      .selectAll(".grid-text")
      .data(gridData, d => d)
      .enter()
      .append("text")
      .attr("class", "grid-text")
      .attr("x", dims.width - margin.left)
      .attr("y", d => storedValues.current.yScale(d))
      .attr("dy", d => (d < 5 ? -4 : 12))
      .attr("text-anchor", "end")
      .attr("font-size", fontSize[1])
      .attr("fill", COLORS.gridColor)
      .text(d => d)
  }

  function getXPosition(d) {
    const { currXScale } = storedValues.current
    return Number(
      currXScale(new Date(d.release_date)) + margin.left >= dims.width / 2
    )
  }

  function setActiveMovie(d) {
    props.activeMovie.id !== d.id &&
      props.setActiveMovie({
        id: d.id,
        data: d,
        position: getXPosition(d),
      })
  }

  const timeOut = useRef(null)

  function addUpdateInteractions() {
    const { currXScale, voronoiArea } = storedValues.current

    voronoiArea
      .selectAll(".voronoi-path")
      .on("mouseover", d => {
        const setHoveredMovie = () =>
          props.setHoveredMovie({
            id: d.id,
            data: d,
            yPosition: props.tooltipYPosition,
            x: currXScale(new Date(d.release_date)),
            xPosition: getXPosition(d),
          })
        if (!props.isFirstEntered) {
          setHoveredMovie()
        }
        if (props.isFirstEntered) {
          timeOut.current = setTimeout(() => {
            props.setIsFirstEntered(false)
            setHoveredMovie()
          }, TIMEOUT.short)
        }
      })
      .on("mouseout", () => {
        clearTimeout(timeOut.current)
        props.setHoveredMovie(NO_HOVERED_MOVIE)
      })
      .on("click", setActiveMovie)
  }

  function createUpdateVoronoi() {
    const {
      yScale,
      currXScale,
      filteredData,
      voronoiArea,
    } = storedValues.current
    const setXPos = d => currXScale(new Date(d.release_date)) + margin.left
    const setYPos = d => yScale(d.vote_average) + margin.top
    const delaunay = Delaunay.from(filteredData, setXPos, setYPos).voronoi([
      0,
      0,
      dims.width,
      dims.height,
    ])

    voronoiArea
      .selectAll(".voronoi-path")
      .data(filteredData, d => d.id)
      .join(
        enter =>
          enter
            .append("path")
            .attr("class", "voronoi-path")
            .attr("fill", "transparent")
            .attr("cursor", d =>
              props.activeMovie.id === d.id ? "default" : "pointer"
            )
            .attr("d", (_, i) => delaunay.renderCell(i))
            .call(enter => enter),
        update =>
          update.call(update =>
            update.transition().attr("d", (_, i) => delaunay.renderCell(i))
          )
      )
    addUpdateInteractions()
  }

  useYDomainSyncUpdate({
    storedValues,
    isYDomainSynced,
    prevIsYDomainSynced: prevProps && prevProps.isYDomainSynced,
    isSizeDynamic,
    createUpdateVoronoi,
    chart,
  })
  useRadiusUpdate({
    storedValues,
    chart,
    isSizeDynamic,
    prevIsSizeDynamic: prevProps && prevProps.isSizeDynamic,
  })
  useChartResize({
    dims,
    prevDims,
    storedValues,
    margin,
    createUpdateVoronoi,
  })
  useActiveMovieIDUpdate({
    storedValues,
    setActiveMovie,
    activeMovieID: props.activeMovie.id,
    prevActiveMovieID: prevProps && prevProps.activeMovie.id,
    isSizeDynamic,
    chart,
    dims,
    addUpdateInteractions,
  })
  useHoveredUpdate({
    storedValues,
    isSizeDynamic,
    hoveredMovie: props.hoveredMovie,
    prevHoveredMovie: prevProps && prevProps.hoveredMovie,
    chart,
    dims,
    addUpdateInteractions,
  })

  useEffect(() => {
    if (
      storedValues.current.isInit &&
      props.isFirstEntered !== prevProps.isFirstEntered
    ) {
      addUpdateInteractions()
    }
  })

  return (
    <Wrapper ref={ref}>
      <ChartTitle>
        <div style={{ position: "absolute", opacity: 0.1 }}>{type}</div>
        <div style={{ position: "relative" }}>
          <NumberContainer>
            {number && number.toString().padStart(3, "0")}
          </NumberContainer>
        </div>
      </ChartTitle>
      <ChartSvg ref={svgAreaRef}>
        <g
          ref={gridAreaRef}
          style={{ transform: `translate(${margin.left}px,${margin.top}px)` }}
        />
        <g
          ref={chartAreaRef}
          style={{ transform: `translate(${margin.left}px,${margin.top}px)` }}
        />
        <g ref={voronoiRef} />
      </ChartSvg>
    </Wrapper>
  )
}

BubbleChart.defaultProps = {
  margin: {
    top: 20,
    bottom: 20,
    ...CHART_SIDE_MARGINS,
  },
  sizeRange: SIZE_RANGE,
}
