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

const TypeContainer = styled(motion.div)`
  position: absolute;
  font-size: ${themifyFontSize(4)};
  font-weight: 200;
  text-transform: uppercase;
  color: ${colors.grayDarker};
  z-index: 0;
`

export default function BubbleChart(props) {
  const prevProps = usePrevious(props)
  const { data, margin, type, xScale, sizeScale, yDomainSynced } = props
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
      storedValues.current = {
        isInit: true,
        currXScale,
        currSizeScale,
        yScale,
        chartArea,
        filteredData,
      }
      createUpdateCircles()
    }
  })

  function createUpdateCircles() {
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
      .join(enter =>
        enter
          .append("circle")
          .attr("class", "main-circle")
          .attr("cx", ({ release_date }) => currXScale(new Date(release_date)))
          .attr("cy", ({ vote_average }) => yScale(vote_average))
          .attr("r", ({ vote_count }) => currSizeScale(vote_count))
          .attr("fill", COLORS.secondary)
          .attr("stroke", chroma(COLORS.secondary).darken())
      )
  }

  // useYDomainSyncUpdate
  useEffect(() => {
    if (
      storedValues.current.isInit &&
      props.yDomainSynced !== prevProps.yDomainSynced
    ) {
      const { yScale, filteredData, chartArea } = storedValues.current
      yScale.domain(
        yDomainSynced ? [0, 10] : extent(filteredData, d => d.vote_average)
      )
      // chartArea
      //   .selectAll(".main-circle")
      //   .each((d, i, n) => console.log(select(n[i]).datum()))
      gsap.to(".main-circle", {cy: (i, el) => {
        const object  = select(el).datum()
        return yScale(object.vote_average)
      }},);
      storedValues.current = {
        ...storedValues.current,
        yScale,
      }
    }
  }, [prevProps, props, yDomainSynced])

  return (
    <Wrapper ref={ref}>
      <TypeContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        {type}
      </TypeContainer>
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
