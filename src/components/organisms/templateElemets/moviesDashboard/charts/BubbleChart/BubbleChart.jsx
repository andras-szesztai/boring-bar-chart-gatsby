import React, { useState, useEffect, useRef } from "react"
import styled, { css } from "styled-components"
import { motion } from "framer-motion"
import chroma from "chroma-js"
import { scaleLinear } from "d3-scale"
import { extent } from "d3-array"
import { select } from "d3-selection"
import { useMeasure } from "react-use"
import "d3-transition"
import { Delaunay } from "d3-delaunay"

import { usePrevious } from "../../../../../../hooks"
import { COLORS, SIZE_RANGE, CHART_SIDE_MARGINS } from "../../../../../../constants/moviesDashboard"
import { themifyFontSize } from "../../../../../../themes/mixins"
import { colors, fontSize } from "../../../../../../themes/theme"

import {
  useYDomainSyncUpdate,
  useRadiusUpdate,
  useActiveMovieIDUpdate,
} from "./hooks"
import { setRadius } from "./utils"
import { makeUniqData } from "../../utils"

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

  .voronoi-path {
    cursor: pointer;
  }
`

const ChartTitle = styled(motion.div)`
  font-size: ${themifyFontSize(12)};
  line-height: 0.8;
  font-weight: 500;
  text-transform: uppercase;
  color: ${colors.grayDark};
  position: absolute;
  top: 12px;
`

const NumberContainer = styled(motion.div)`
  font-size: ${themifyFontSize(4)};
  line-height: 0.8;
  font-weight: 500;
  text-transform: uppercase;
  color: ${colors.grayDark};
  opacity: 0.5;
  position: absolute;
  top: 8px;
`

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
      const filteredData = makeUniqData(data, props.type)
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

  function createUpdateVoronoi() {
    const { yScale, currXScale, filteredData } = storedValues.current
    const setXPos = d => currXScale(new Date(d.release_date)) + margin.left
    const setYPos = d => yScale(d.vote_average) + margin.top
    const delaunay = Delaunay.from(filteredData, setXPos, setYPos).voronoi([
      0,
      0,
      dims.width,
      dims.height,
    ])

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
            .on("click", d =>
              props.setActiveMovie({
                id: d.id,
                data: d,
                position: Number(
                  currXScale(new Date(d.release_date)) + margin.left >=
                    dims.width / 2
                ),
              })
            )
            .call(enter => enter),
        update =>
          update.call(update =>
            update.transition().attr("d", (_, i) => delaunay.renderCell(i))
          )
      )
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
  useActiveMovieIDUpdate({
    storedValues,
    activeMovieID: props.activeMovie.id,
    prevActiveMovieID: prevProps && prevProps.activeMovie.id,
    isSizeDynamic,
    chart,
    dims,
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
    ...CHART_SIDE_MARGINS
  },
  sizeRange: SIZE_RANGE,
}