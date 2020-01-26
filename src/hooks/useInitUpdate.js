import { useState, useEffect } from "react"

import usePrevious from "./usePrevious"
import { checkIfUpdated } from "../utils/chartHelpers"

export default function useInitUpdate({
  data,
  chartHeight,
  chartWidth,
  initVis,
  updateVisData,
  updateVisDims,
  sortKey,
  noKey,
}) {
  const [state, setState] = useState({
    init: false,
  })
  const { init } = state

  const prevData = usePrevious(data)
  const prevChartWidth = usePrevious(chartWidth)
  const prevChartHeight = usePrevious(chartHeight)
  useEffect(() => {
    if (!init && chartHeight && chartWidth && data) {
      setState(prev => ({ ...prev, init: true }))
      initVis()
    }
    const sortFunc = (a, b) => (noKey ? a - b : a[sortKey] - b[sortKey])
    if (
      init &&
      prevData &&
      checkIfUpdated(data.sort(sortFunc), prevData.sort(sortFunc))
    ) {
      updateVisData()
    }
    if (
      init &&
      (chartWidth !== prevChartWidth || chartHeight !== prevChartHeight)
    ) {
      updateVisDims ? updateVisDims() : updateVisData()
    }
  }, [chartHeight, chartWidth, data, init, initVis, noKey, prevChartHeight, prevChartWidth, prevData, sortKey, state, updateVisData, updateVisDims])

  return state
}
