import React, { useRef, useEffect } from "react"
import { scaleBand, scaleLinear } from "d3-scale"
import { max, min } from "d3-array"
import { easeCubicInOut } from "d3-ease"
import { select } from "d3-selection"
import { axisBottom } from "d3-axis"
import _ from "lodash"
import { format } from "d3-format"

import {
  usePrevious,
  useChartRefs,
  useDimensions,
  useInitUpdate,
} from "../../../hooks"
import ChartStarter from "./ChartStarter"
import { transition, colors, fontWeight } from "../../../themes/theme"
import {
  createUpdateNumberText,
  getAxisPadding,
} from "../../../utils/chartHelpers"

const { mdNum } = transition
const { grayDarkest, grayLighter } = colors
const { light, semiBold } = fontWeight

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
  isBar,
  isCircle,
}) {
  const valueStore = useRef()
  const prevHighlightedValue = usePrevious(highlightedValue)
  const prevData = usePrevious(data)
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
    prevData,
    xKey,
    yKey,
    ref: refs.areaRef.current,
    numberFormat,
    prefix,
    suffix,
    moveTextHigher: isCircle ? 5 : 1,
  })

  const getAxisDomain = () => {
    const axisPadding = getAxisPadding(
      data.filter(d => !d.filteredOut),
      yKey,
      0.1
    )
    return isBar
      ? [0, max(data, d => d[yKey])]
      : [
          min(data.filter(d => !d.filteredOut), d => d[yKey]) - axisPadding,
          max(data, d => d[yKey]) + axisPadding,
        ]
  }

  function initVis() {
    const xScale = scaleBand()
      .domain(data.map(d => d[xKey]))
      .range([0, dims.chartWidth])
      .paddingInner(paddingInner)
      .paddingOuter(paddingOuter)
    const yScale = scaleLinear()
      .domain(getAxisDomain())
      .range([dims.chartHeight, 0])
    valueStore.current = {
      xScale,
      yScale,
    }
    isBar && createUpdateRectangles()
    if (isCircle) {
      createUpdateYRefLine()
      createUpdateCircles()
    }
    createUpdateNumberText(getNumberTextParams({ xScale, yScale }))
    createUpdateXAxis({ withDelay: true })
    highlightValue()
  }

  function updateVisData() {
    const { xScale, yScale } = valueStore.current
    xScale.domain(data.map(d => d[xKey]))
    yScale.domain(getAxisDomain())
    valueStore.current = {
      xScale,
      yScale,
    }
    isBar && createUpdateRectangles()
    if (isCircle) {
      createUpdateYRefLine()
      createUpdateCircles()
    }
    createUpdateNumberText(getNumberTextParams({ xScale, yScale }))
    createUpdateXAxis({})
    highlightValue()
  }

  function highlightValue() {
    const chartArea = select(refs.areaRef.current)
    const isHighlighted = (d, noAccessor) =>
      !d.filteredOut &&
      (noAccessor ? d.toLowerCase() : d[xKey]) === highlightedValue
    const setHighlightedFill = (d, noAcessor) =>
      isHighlighted(d, noAcessor) ? highlightColor : defaultColor
    const setHighlightedFontWeight = (d, noAcessor) =>
      isHighlighted(d, noAcessor) ? semiBold : light
    const setOpacity = d => (d.isFilteredOut ? 0 : 1)
    isBar &&
      chartArea.selectAll("rect").attr("fill", d => setHighlightedFill(d))
    isCircle &&
      chartArea
        .selectAll("circle")
        .attr("fill", d => setHighlightedFill(d))
        .attr("opacity", setOpacity)
    chartArea
      .selectAll(".number-text")
      .attr("fill", d => setHighlightedFill(d))
      .attr("font-weight", d => setHighlightedFontWeight(d))
      .attr("opacity", setOpacity)
    select(refs.xAxisRef.current).call(g =>
      g
        .selectAll(".tick text")
        .attr("fill", d => setHighlightedFill(d, true))
        .attr("font-weight", d => setHighlightedFontWeight(d, true))
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

  function createUpdateYRefLine() {
    const { yScale } = valueStore.current
    const meanY = _.meanBy(data.filter(d => !d.filteredOut), yKey)
    const chartArea = select(refs.areaRef.current)

    if (!init) {
      chartArea
        .append("line")
        .attr("class", "y-ref-line")
        .attr("x1", 0)
        .attr("x2", dims.chartWidth)
        .attr("y1", yScale(meanY))
        .attr("y2", yScale(meanY))
        .attr("stroke", grayLighter)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4, 1")
      chartArea
        .append("text")
        .attr("class", "y-ref-line-text")
        .attr("x", 0)
        .attr("y", yScale(meanY))
        .attr("font-weight", semiBold)
        .attr("dy", textDy)
        .text(`Mean: ${format(numberFormat)(meanY)}`)
    }

    if (init) {
      chartArea
        .select(".y-ref-line")
        .attr("y1", yScale(meanY))
        .attr("y2", yScale(meanY))
      chartArea
        .select("y-ref-line-text")
        .attr("y", yScale(meanY))
        .text(`Mean: ${format(numberFormat)(meanY)}`)
    }
  }

  function createUpdateCircles(duration = transitionDuration) {
    const { xScale, yScale } = valueStore.current
    const getXPos = d => xScale(d[xKey]) + xScale.bandwidth() / 2
    select(refs.areaRef.current)
      .selectAll("circle")
      .data(data, d => d[xKey])
      .join(
        enter =>
          enter
            .append("circle")
            .attr("cx", getXPos)
            .attr("cy", yScale(0))
            .attr("r", xScale.bandwidth() / 4)
            .attr("fill", d =>
              d[xKey] === highlightedValue ? highlightColor : defaultColor
            )
            .call(enter =>
              enter
                .transition()
                .duration(duration)
                .delay((_, i) => (i * transitionDuration) / data.length)
                .ease(easeCubicInOut)
                .attr("cy", d => yScale(d[yKey]))
            ),
        update =>
          update.call(update =>
            update
              .transition()
              .duration(duration)
              .ease(easeCubicInOut)
              .attr("cx", getXPos)
              .attr("cy", d => yScale(d[yKey]))
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
    sortKey: yKey,
    initVis,
    updateVisData,
  })

  return (
    <ChartStarter
      refs={refs}
      margin={margin}
      dims={dims}
      withXAxis
      axisBottom
      fontSize={0}
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
}
