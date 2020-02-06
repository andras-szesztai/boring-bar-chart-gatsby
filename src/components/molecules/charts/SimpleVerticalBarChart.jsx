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
  itemDelay,
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
    createUpdateXAxis({ withDelay: true })
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
    createUpdateXAxis({ duration: mdNum })
  }

  function highlightValue() {
    select(refs.areaRef.current)
      .selectAll("rect")
      .attr("fill", d =>
        d[xKey] === highlightedValue ? highlightColor : defaultColor
      )
  }

  function createUpdateRectangles(duration = mdNum) {
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
                .delay((_, i) => i * itemDelay)
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

  function createUpdateText(duration = mdNum) {
    // const { xScale, yScale } = valueStore.current
    // select(refs.areaRef.current)
    //   .selectAll("text")
    //   .data(data)
    //   .join(
    //     enter =>
    //       enter
    //         .append("text")
    //         .attr("x", d => xScale(d[xKey]))
    //         .attr("y", yScale(0))
    //         .attr("width", xScale.bandwidth())
    //         .attr("height", 0)
    //         .attr("fill", d =>
    //           d[xKey] === highlightedValue ? highlightColor : defaultColor
    //         )
    //         .call(enter =>
    //           enter
    //             .transition()
    //             .duration(duration)
    //             .delay((_, i) => i * itemDelay)
    //             .ease(easeCubicInOut)
    //             .attr("y", d => yScale(d[yKey]))
    //             .attr("height", d => yScale(0) - yScale(d[yKey]))
    //         ),
    //     update =>
    //       update.call(update =>
    //         update
    //           .transition()
    //           .duration(duration)
    //           .ease(easeCubicInOut)
    //           .attr("x", d => xScale(d[xKey]))
    //           .attr("width", xScale.bandwidth())
    //           .attr("y", d => yScale(d[yKey]))
    //           .attr("height", d => yScale(0) - yScale(d[yKey]))
    //       )
    //   )
  }

  function createUpdateXAxis({ duration = mdNum, withDelay }) {
    // TODO: fix this part
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
      .call(g =>
        g
          .selectAll(".tick text")
          .attr("opacity", withDelay ? 0 : 1)
          .transition()
          .duration(duration)
          .delay((_, i) => (withDelay ? i * itemDelay : 0))
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
  itemDelay: 100,
}
