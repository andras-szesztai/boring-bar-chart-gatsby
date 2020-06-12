import React, { useEffect, useRef } from "react"
import chroma from "chroma-js"
import _ from "lodash"
import { select } from "d3-selection"
import { useMeasure } from "react-use"
import "d3-transition"
import { axisBottom } from "d3-axis"
import { Delaunay } from "d3-delaunay"

import {
  COLORS,
  SIZE_RANGE,
  CIRCLE_ADJUST,
  CHART_SIDE_MARGINS,
  NO_HOVERED_MOVIE,
  TIMEOUT,
} from "../../../../../../constants/moviesDashboard"
import { fontSize } from "../../../../../../themes/theme"
import { usePrevious } from "../../../../../../hooks"

import { useSelectedUpdate, useHoveredUpdate, useChartResize } from "./hooks"
import Tooltip from "./Tooltip/Tooltip"
import { Wrapper, ChartSvg, LabelContainer } from "./styles"

export default function DateAxis(props) {
  const { margin, xScale, mainData, subData, activeMovie, hoveredMovie } = props
  const prevProps = usePrevious(props)
  const storedValues = useRef({ isInit: false })
  const chartAreaRef = useRef(null)
  const svgAreaRef = useRef(null)
  const voronoiRef = useRef(null)
  const [ref, dims] = useMeasure()

  useEffect(() => {
    if (!storedValues.current.isInit && dims.width) {
      const filteredData = _.uniqBy([...mainData, ...subData], "id")
        .filter(d => !!d.release_date && !!d.vote_count)
        .sort((a, b) => b.vote_count - a.vote_count)
      const currXScale = xScale.range([
        0,
        dims.width - margin.left - margin.right,
      ])
      const chartArea = select(chartAreaRef.current)
      const svgArea = select(svgAreaRef.current)
      const voronoiArea = select(voronoiRef.current)
      storedValues.current = {
        isInit: true,
        currXScale,
        filteredData,
        chartArea,
        svgArea,
        voronoiArea,
      }
      createDateAxis()
      createUpdateVoronoi()
      createRefElements("hovered")
      createRefElements("selected")
    }
  })

  function createDateAxis() {
    const { currXScale, chartArea } = storedValues.current
    chartArea
      .call(
        axisBottom(currXScale)
          .ticks(dims.width / 100)
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

  function createRefElements(className) {
    const { chartArea } = storedValues.current
    const strokeColor =
      className === "hovered"
        ? COLORS.secondary
        : chroma(COLORS.secondary).darken()
    chartArea
      .append("circle")
      .attr("class", `${className}-circle`)
      .attr("cy", 0)
      .attr("cx", 0)
      .attr("r", SIZE_RANGE[0] + CIRCLE_ADJUST)
      .attr("fill", "#fff")
      .attr("stroke", strokeColor)
      .attr("stroke-width", 1)
      .attr("opacity", 0)
    chartArea
      .append("circle")
      .attr("class", `${className}-circle`)
      .attr("cy", 0)
      .attr("cx", 0)
      .attr("r", SIZE_RANGE[0])
      .attr("fill", COLORS.secondary)
      .attr("stroke", strokeColor)
      .attr("stroke-width", 1)
      .attr("opacity", 0)
    chartArea
      .append("line")
      .attr("class", `${className}-top-line ${className}-line`)
      .attr("y1", -SIZE_RANGE[0] - CIRCLE_ADJUST)
      .attr("y2", -SIZE_RANGE[0] - CIRCLE_ADJUST)
      .attr("stroke", strokeColor)
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("stroke-width", 1)
      .attr("opacity", 0)
    chartArea
      .append("line")
      .attr("class", `${className}-bottom-line ${className}-line`)
      .attr("y1", SIZE_RANGE[0] + CIRCLE_ADJUST)
      .attr("y2", SIZE_RANGE[0] + CIRCLE_ADJUST)
      .attr("stroke", strokeColor)
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("stroke-width", 1)
      .attr("opacity", 0)
    if (className === "hovered") {
      chartArea
        .append("line")
        .attr("class", `${className}-horizontal-line ${className}-line`)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("stroke", strokeColor)
        .attr("stroke-width", 1)
        .attr("opacity", 0)
    }
  }

  function getXPosition(d) {
    const { currXScale } = storedValues.current
    return Number(
      currXScale(new Date(d.release_date)) + margin.left >= dims.width / 2
    )
  }

  const timeOut = useRef(null)

  function addUpdateInteractions() {
    const { voronoiArea } = storedValues.current

    voronoiArea
      .selectAll(".voronoi-path")
      .on("mouseover", d => {
        const setHoveredMovie = () =>
          props.setHoveredMovie({
            id: d.id,
            data: d,
            yPosition: !!mainData.find(mD => _.isEqual(d, mD)) ? 0 : 1,
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
      .on("click", d => {
        props.setActiveMovie({
          id: d.id,
          data: d,
          position: getXPosition(d),
        })
      })
  }

  function createUpdateVoronoi() {
    const { currXScale, filteredData, voronoiArea } = storedValues.current
    const setXPos = d => currXScale(new Date(d.release_date)) + margin.left
    const delaunay = Delaunay.from(
      filteredData,
      setXPos,
      () => dims.height / 2
    ).voronoi([0, 0, dims.width, dims.height])

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

  useChartResize({
    dims,
    storedValues,
    margin,
    createUpdateVoronoi,
    createDateAxis,
  })

  useSelectedUpdate({
    storedValues,
    activeMovieID: activeMovie.id,
    prevActiveMovieID: prevProps && prevProps.activeMovie.id,
    type: props.type,
    data: { mainData, subData },
    dims,
    addUpdateInteractions,
  })

  useHoveredUpdate({
    storedValues,
    hoveredMovie,
    prevHoveredMovie: prevProps && prevProps.hoveredMovie,
    dims,
    mainData,
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
      <ChartSvg ref={svgAreaRef}>
        <g
          ref={chartAreaRef}
          style={{
            transform: `translate(${margin.left}px,${dims.height / 2}px)`,
          }}
        />
        <g ref={voronoiRef} />
      </ChartSvg>
      <Tooltip
        xScale={storedValues && storedValues.current.currXScale}
        hoveredMovie={props.hoveredMovie}
        activeMovieID={activeMovie.id}
      />
      <LabelContainer>
        Release year
      </LabelContainer>
    </Wrapper>
  )
}

DateAxis.defaultProps = {
  margin: {
    top: 20,
    bottom: 20,
    ...CHART_SIDE_MARGINS,
  },
}
