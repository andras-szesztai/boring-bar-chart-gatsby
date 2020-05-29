import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import _ from "lodash"
import { scaleTime, scaleLinear } from "d3-scale"
import { extent } from "d3-array"
import useResizeAware from "react-resize-aware"
import { select } from "d3-selection"
import { useMeasure } from "react-use"
import { usePrevious } from "../../../../../../hooks"

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`

const ChartSvg = styled.svg`
  position: absolute;
  height: 100%;
  width: 100%;
`

export default function BubbleChart({ data, margin }) {
  const storedValues = useRef({ isInit: false })
  const chartAreaRef = useRef(null)
  const [ref, dims] = useMeasure()
  const prevDims = usePrevious(dims)

  useEffect(() => {
    if (
      !storedValues.current.isInit &&
      prevDims &&
      !prevDims.width &&
      dims.width
    ) {
      const filteredData = data.filter(d => !!d.release_date && !!d.vote_count)
      const xScale = scaleTime()
        .domain(extent(filteredData, d => new Date(d.release_date)))
        .range([0, dims.width - margin.left - margin.right])
      const yScale = scaleLinear()
        .domain([0, 10])
        .range([dims.height - margin.top - margin.bottom, 0])
      const chartArea = select(chartAreaRef.current)
      storedValues.current = {
        isInit: true,
        xScale,
        yScale,
        chartArea,
        filteredData,
      }
      createUpdateCircles()
    }
  })

  function createUpdateCircles() {
    const { xScale, yScale, chartArea, filteredData } = storedValues.current

    chartArea
      .selectAll(".main-circle")
      .data(filteredData, d => d.id)
      .join(enter =>
        enter
          .append("circle")
          .attr("class", "main-circle")
          .attr("cx", ({ release_date }) => xScale(new Date(release_date)))
          .attr("cy", ({ vote_average }) => yScale(vote_average))
          .attr("r", 5)
          .attr("fill", "#eee")
          .attr("fill-opacity", 0.5)
          .attr("stroke", "#333")
      )
  }

  return (
    <Wrapper ref={ref}>
      <ChartSvg>
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
    left: 25,
    bottom: 20,
    right: 25,
  },
}
