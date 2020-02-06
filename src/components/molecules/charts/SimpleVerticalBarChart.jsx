import React, { useRef, useEffect } from "react"
import { scaleBand, scaleLinear } from "d3-scale"
import { max } from "d3-array"
import { easeCubicInOut } from "d3-ease"
import { select } from "d3-selection"

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
  console.log(highlightedValue)

  const valueStore = useRef()
  const prevHighlightedValue = usePrevious(highlightedValue)
  const refs = useChartRefs()
  const dims = useDimensions({
    ref: refs.wrapperRef,
    margin,
  })

  useEffect(() => {
    if(prevHighlightedValue !== highlightedValue){
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
    createUpdateXAxis()
  }

  function updateVisData() {}

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
      .data(data)
      .join(enter =>
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
          )
      )
  }

  function createUpdateXAxis() {}

  const { init } = useInitUpdate({
    data: data && Object.values(data),
    chartHeight: dims.chartHeight,
    chartWidth: dims.chartWidth,
    initVis,
    noKey: true,
    updateVisData,
  })

  return <ChartStarter refs={refs} margin={margin} dims={dims} />
}

SimpleVerticalBarChart.defaultProps = {
  margin: {
    top: 10,
    right: 5,
    bottom: 10,
    left: 5,
  },
  paddingInner: 0.1,
  paddingOuter: 0.1,
  defaultColor: grayLighter,
  highlightColor: grayDarkest,
  itemDelay: 100,
}
