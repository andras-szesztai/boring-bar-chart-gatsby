import React, { useRef, useEffect } from "react"
import { stack } from "d3-shape"
import { select } from "d3-selection"
import _ from "lodash"
import { scaleOrdinal, scaleLinear } from "d3-scale"
import chroma from "chroma-js"
import "d3-transition"
import { easeCubicInOut } from "d3-ease"

import {
  useDimensions,
  useInitUpdate,
  usePrevious,
  useChartRefs,
} from "../../../hooks"
import { transition } from "../../../themes/theme"
import ChartStarter from "./ChartStarter"

const { mdNum } = transition

export default function HorizontalStackedBar({
  data,
  margin,
  colorRange,
  highlightArray,
}) {
  const refs = useChartRefs()
  const valueStore = useRef()
  const dims = useDimensions({
    ref: refs.wrapperRef,
    margin,
  })

  const makeData = keys => stack().keys(keys)([data])

  function initVis() {
    const keys = Object.keys(data)
    const colorScale = scaleOrdinal()
      .domain(keys)
      .range(colorRange)
    const xScale = scaleLinear()
      .domain([0, 1])
      .range([0, dims.chartWidth])
    valueStore.current = {
      colorScale,
      xScale,
    }
    createUpdateRectangles()
  }

  function updateVisData() {
    createUpdateRectangles()
  }

  function updateVisDims() {
    const { xScale } = valueStore.current
    xScale.range([0, dims.chartWidth])
    valueStore.current = {
      xScale,
    }
    createUpdateRectangles(0)
  }

  function createUpdateRectangles(duration = mdNum) {
    const { xScale, colorScale } = valueStore.current
    select(refs.areaRef.current)
      .selectAll("rect")
      .data(makeData(Object.keys(data)))
      .join(
        enter =>
          enter
            .append("rect")
            .attr("fill", d => colorScale(d.key))
            .attr("stroke", d => chroma(colorScale(d.key)).darken())
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1)
            .attr("x", d => xScale(d[0][0]))
            .attr("width", d => xScale(d[0][1]) - xScale(d[0][0]))
            .attr("y", 0)
            .attr("height", dims.chartHeight)
            .call(enter => enter),
        update =>
          update.call(update =>
            update
              .transition()
              .duration(duration)
              .ease(easeCubicInOut)
              .attr("x", d => xScale(d[0][0]))
              .attr("width", d => xScale(d[0][1]) - xScale(d[0][0]))
          )
      )
  }

  const { init } = useInitUpdate({
    data: data && Object.values(data),
    chartHeight: dims.chartHeight,
    chartWidth: dims.chartWidth,
    initVis,
    noKey: true,
    updateVisData,
    updateVisDims,
  })

  const prevHighlightArray = usePrevious(highlightArray)
  useEffect(() => {
    function updateHighlight() {
      select(refs.areaRef.current)
        .selectAll("rect")
        .transition()
        .duration(mdNum)
        .attr("fill-opacity", d => (highlightArray.includes(d.key) ? 1 : 0.2))
        .attr("stroke-opacity", d => (highlightArray.includes(d.key) ? 1 : 0.2))
    }
    if (init && !_.isEqual(prevHighlightArray, highlightArray))
      updateHighlight()
  }, [highlightArray, init, prevHighlightArray, refs.areaRef])

  return (
    <ChartStarter
      refs={refs}
      margin={margin}
      dims={dims}
      withXAxis
      axisBottom
    />
  )
}
