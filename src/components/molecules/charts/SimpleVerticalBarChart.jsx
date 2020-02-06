import React from "react"
import { usePrevious, useChartRefs, useDimensions } from "../../../hooks"
import ChartStarter from "./ChartStarter"
import { transition } from "../../../themes/theme"

const { mdNum } = transition

export default function SimpleVerticalBarChart({
  data,
  highlightedValue,
  margin,
}) {
  const prevHighlightedValue = usePrevious(highlightedValue)
  const refs = useChartRefs()
  const dims = useDimensions({
    ref: refs.wrapperRef,
    margin,
  })

  function initVis() {}

  function updateVisData() {}

  function highlightValue() {}

  function createUpdateRectangles(duration = mdNum) {}

  function createUpdateXAxis() {}

  return <ChartStarter refs={refs} margin={margin} dims={dims} />
}

SimpleVerticalBarChart.defaultProps = {}
