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
  dataToCheck = data,
  noKey,
}) {
  const [state, setState] = useState({
    init: false,
  })
  const { init } = state

  const prevData = usePrevious(dataToCheck)
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
      checkIfUpdated(dataToCheck.sort(sortFunc), prevData.sort(sortFunc))
    ) {
      updateVisData()
    }
    if (
      init &&
      (chartWidth !== prevChartWidth || chartHeight !== prevChartHeight)
    ) {
      updateVisDims ? updateVisDims() : updateVisData()
    }
  }, [
    chartHeight,
    chartWidth,
    data,
    dataToCheck,
    init,
    initVis,
    noKey,
    prevChartHeight,
    prevChartWidth,
    prevData,
    sortKey,
    updateVisData,
    updateVisDims,
  ])

  return state
}
