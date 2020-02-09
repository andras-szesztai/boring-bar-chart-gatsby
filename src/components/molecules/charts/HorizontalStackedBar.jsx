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
import { transition, fontWeight, fontSize } from "../../../themes/theme"
import ChartStarter from "./ChartStarter"
import { numberTween } from "../../../utils/chartHelpers"

const { mdNum } = transition

export default function HorizontalStackedBar({
  data,
  margin,
  colorRange,
  highlightArray,
  withNumber,
  transitionDuration,
  textDy,
  numberFormat,
}) {
  const refs = useChartRefs()
  const valueStore = useRef()
  const dims = useDimensions({
    ref: refs.wrapperRef,
    margin,
  })
  const prevData = usePrevious(data)

  const makeData = keys =>
    stack()
      .keys(keys)([data])
      .map(el => ({ ...el, value: data[el.key] }))

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
    withNumber && createUpdateNumberText()
  }

  function updateVisData() {
    createUpdateRectangles()
    withNumber && createUpdateNumberText()
  }

  function updateVisDims() {
    const { xScale } = valueStore.current
    xScale.range([0, dims.chartWidth])
    valueStore.current = {
      xScale,
    }
    createUpdateRectangles()
    createUpdateNumberText()
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

  function createUpdateNumberText(duration = transitionDuration) {
    const { xScale, colorScale } = valueStore.current
    const getXPosition = d =>
      xScale(d[0][0]) + (xScale(d[0][1]) - xScale(d[0][0])) / 2
    const getTween = (d, i, n) =>
      numberTween({
        value: data[d.key],
        prevValue: prevData ? prevData[d.key] : 0,
        i,
        n,
        numberFormat,
      })
    select(refs.areaRef.current)
      .selectAll("text")
      .data(makeData(Object.keys(data)))
      .join(
        enter =>
          enter
            .append("text")
            .attr("x", getXPosition)
            .attr("font-size", fontSize[2])
            .attr("font-weight", fontWeight.medium)
            .attr("fill", d => chroma(colorScale(d.key)).brighten(3))
            .attr("y", dims.chartHeight / 2)
            .attr("dy", textDy)
            .attr("text-anchor", "middle")
            .text(0)
            .call(enter =>
              enter
                .transition()
                .duration(duration)
                .ease(easeCubicInOut)
                .tween("text", getTween)
            ),
        update =>
          update.call(update =>
            update
              .transition()
              .duration(duration)
              .ease(easeCubicInOut)
              .attr("x", getXPosition)
              .tween("text", getTween)
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
      const { colorScale } = valueStore.current
      const isHighlighted = d => highlightArray.includes(d.key)
      const getOpacity = d => (isHighlighted(d) ? 1 : 0.2)
      const getFill = d =>
        isHighlighted(d)
          ? chroma(colorScale(d.key)).brighten(3)
          :  chroma(colorScale(d.key)).darken(2)
      select(refs.areaRef.current)
        .selectAll("rect")
        .transition()
        .duration(mdNum)
        .attr("fill-opacity", getOpacity)
        .attr("stroke-opacity", getOpacity)

      select(refs.areaRef.current)
        .selectAll("text")
        .attr("fill", getFill)
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

HorizontalStackedBar.defaultProps = {
  textDy: 5,
  transitionDuration: mdNum,
  numberFormat: ",.1%",
}
