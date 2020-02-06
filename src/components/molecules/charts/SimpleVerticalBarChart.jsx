import React, { useRef } from "react"
import { usePrevious, useChartRefs, useDimensions, useInitUpdate } from "../../../hooks"
import ChartStarter from "./ChartStarter"
import { transition } from "../../../themes/theme"
import { scaleBand, scaleLinear } from "d3-scale"
import { max } from "d3-array"

const { mdNum } = transition

export default function SimpleVerticalBarChart({
  data,
  xKey,
  yKey,
  highlightedValue,
  margin,
  paddingInner,
  paddingOuter,
}) {
  const valueStore = useRef()
  const prevHighlightedValue = usePrevious(highlightedValue)
  const refs = useChartRefs()
  const dims = useDimensions({
    ref: refs.wrapperRef,
    margin,
  })

  function initVis() {
    const xScale = scaleBand()
      .domain(data.map(d => d[xKey]))
      .range([0, dims.chartWidth])
      .paddingInner(0.1)
      .paddingOuter(0.1)
    const yScale = scaleLinear()
      .domain(0, max(data, d => d[yKey]))
      .range([dims.chartHeight, 0])
    valueStore.current = {
      xScale,
      yScale,
    }
    createUpdateRectangles()
    createUpdateXAxis()
  }

  function updateVisData() {}

  function highlightValue() {}

  function createUpdateRectangles(duration = mdNum) {}

  function createUpdateXAxis() {}

  const { init } = useInitUpdate({
    data: data && Object.values(data),
    chartHeight: dims.chartHeight,
    chartWidth: dims.chartWidth,
    initVis,
    noKey: true,
    updateVisData
  })

  return <ChartStarter refs={refs} margin={margin} dims={dims} />
}

SimpleVerticalBarChart.defaultProps = {
  margin: {
    top: 0,
    right: 5,
    bottom: 10,
    left: 5,
  },
  paddingInner: 0.1,
  paddingOuter: 0.1,
}
