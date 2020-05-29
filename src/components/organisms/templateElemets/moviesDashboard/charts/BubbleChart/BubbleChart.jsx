import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import _ from "lodash"
import { useEffectOnce } from "react-use"
import { scaleTime, scaleLinear } from "d3-scale"
import { extent } from "d3-array"
import useResizeAware from "react-resize-aware"
import { select } from "d3-selection"

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
  const [resizeListener, sizes] = useResizeAware()

  useEffect(() => {
    if (!storedValues.current.isInit && sizes.width) {
      const xScale = scaleTime()
        .domain(extent(data, d => new Date(d.release_date)))
        .range([0, sizes.width - margin.left - margin.right])
      const yScale = scaleLinear()
        .domain([0, 10])
        .range([sizes.height - margin.top - margin.bottom, 0])
      const chartArea = select(chartAreaRef.current)
      storedValues.current = {
        isInit: true,
        xScale,
        yScale,
        chartArea
      }
      createUpdateCircles()
    }
  })

  function createUpdateCircles() {
    const { xScale, yScale, chartArea } = storedValues.current
    console.log("createUpdateCircles -> data", data)

    chartArea
      .selectAll(".main-circle")
      .data(data)


  }

  return (
    <Wrapper>
      {resizeListener}
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
    top: 10,
    left: 10,
    bottom: 10,
    right: 10,
  },
}
