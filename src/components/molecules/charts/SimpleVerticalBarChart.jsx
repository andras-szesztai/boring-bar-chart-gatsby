import React, { useRef, useEffect } from "react"
import { scaleBand, scaleLinear } from "d3-scale"
import { max } from "d3-array"
import { easeCubicInOut } from "d3-ease"
import { select } from "d3-selection"
import { axisBottom } from "d3-axis"
import _ from "lodash"

import {
  usePrevious,
  useChartRefs,
  useDimensions,
  useInitUpdate,
} from "../../../hooks"
import ChartStarter from "./ChartStarter"
import { transition, colors } from "../../../themes/theme"
import { createUpdateNumberText } from "../../../utils/chartHelpers"

const { mdNum } = transition
const { grayDarkest, grayLighter } = colors

export default function SimpleVerticalBarChart({
  data,
  xKey,
  yKey,
  highlightedValue,
  margin,
  paddingInner,
  paddingOuter,
  defaultColor,
  highlightColor,
  textDy,
  numberFormat,
  prefix,
  suffix,
  transitionDuration,
  isHiddenNumberText,
}) {
  const valueStore = useRef()
  const prevHighlightedValue = usePrevious(highlightedValue)
  const refs = useChartRefs()
  const dims = useDimensions({
    ref: refs.wrapperRef,
    margin,
  })

  useEffect(() => {
    if (init && prevHighlightedValue !== highlightedValue) {
      highlightValue()
    }
  })

  const getNumberTextParams = ({ ...otherParams }) => ({
    ...otherParams,
    duration: transitionDuration,
    textDy,
    data,
    xKey,
    yKey,
    ref: refs.areaRef.current,
    numberFormat,
    prefix,
    suffix,
    isHidden: isHiddenNumberText,
  })

  function initVis() {
    const xScale = scaleBand()
      .domain(data.map(d => d[xKey]))
      .range([0, dims.chartWidth])
      .paddingInner(paddingInner)
      .paddingOuter(paddingOuter)
    const yScale = scaleLinear()
      .domain([0, max(data, d => d[yKey])])
      .range([dims.chartHeight, 0])
    valueStore.current = {
      xScale,
      yScale,
    }
    createUpdateRectangles()
    createUpdateNumberText(getNumberTextParams({ xScale, yScale }))
    createUpdateXAxis({ withDelay: true })
    highlightValue()
  }

  function updateVisData() {
    const { xScale, yScale } = valueStore.current
    xScale.domain(data.map(d => d[xKey]))
    yScale.domain([0, max(data, d => d[yKey])])
    valueStore.current = {
      xScale,
      yScale,
    }
    createUpdateRectangles()
    createUpdateNumberText(getNumberTextParams({ xScale, yScale }))
    createUpdateXAxis({})
    highlightValue()
  }

  function highlightValue() {
    const chartArea = select(refs.areaRef.current)
    chartArea
      .selectAll("rect")
      .attr("fill", d =>
        !d.filteredOut && d[xKey] === highlightedValue
          ? highlightColor
          : defaultColor
      )
    chartArea
      .selectAll(".number-text")
      .attr("opacity", d =>
        !d.filteredOut && d[xKey] === highlightedValue ? 1 : 0
      )
  }

  function createUpdateRectangles(duration = transitionDuration) {
    const { xScale, yScale } = valueStore.current
    select(refs.areaRef.current)
      .selectAll("rect")
      .data(data, d => d[xKey])
      .join(
        enter =>
          enter
            .append("rect")
            .attr("x", d => xScale(d[xKey]))
            .attr("y", yScale(0))
            .attr("width", xScale.bandwidth())
            .attr("height", 0)
            .attr("fill", d =>
              d[xKey] === highlightedValue ? highlightColor : defaultColor
            )
            .call(enter =>
              enter
                .transition()
                .duration(duration)
                .delay((_, i) => (i * transitionDuration) / data.length)
                .ease(easeCubicInOut)
                .attr("y", d => yScale(d[yKey]))
                .attr("height", d => yScale(0) - yScale(d[yKey]))
            ),
        update =>
          update.call(update =>
            update
              .transition()
              .duration(duration)
              .ease(easeCubicInOut)
              .attr("x", d => xScale(d[xKey]))
              .attr("width", xScale.bandwidth())
              .attr("y", d => yScale(d[yKey]))
              .attr("height", d => yScale(0) - yScale(d[yKey]))
          )
      )
  }

  function createUpdateXAxis({ duration = transitionDuration, withDelay }) {
    const { xScale } = valueStore.current
    select(refs.xAxisRef.current)
      .transition()
      .duration(duration)
      .call(
        axisBottom(xScale)
          .tickFormat(d => `${_.capitalize(d)}`)
          .tickSizeOuter(0)
          .tickSizeInner(1)
      )
      .call(g => g.selectAll(".tick line").remove())
      .call(g => g.select(".domain").attr("stroke", highlightColor))
      .call(g =>
        g
          .selectAll(".tick text")
          .attr("opacity", withDelay ? 0 : 1)
          .transition()
          .duration(duration)
          .delay((_, i) => (withDelay ? transitionDuration / data.length : 0))
          .ease(easeCubicInOut)
          .attr("opacity", 1)
          .attr("text-anchor", "start")
          .attr("transform", "rotate(35)")
      )
  }

  const { init } = useInitUpdate({
    data: data && Object.values(data),
    chartHeight: dims.chartHeight,
    chartWidth: dims.chartWidth,
    initVis,
    noKey: true,
    updateVisData,
  })

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

SimpleVerticalBarChart.defaultProps = {
  margin: {
    top: 15,
    right: 15,
    bottom: 35,
    left: 5,
  },
  paddingInner: 0.25,
  paddingOuter: 0.15,
  defaultColor: grayLighter,
  highlightColor: grayDarkest,
  textDy: -2,
  numberFormat: ",.0f",
  transitionDuration: mdNum,
  isHiddenNumberText: true,
}
