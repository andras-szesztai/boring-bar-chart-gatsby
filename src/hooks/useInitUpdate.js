import { useState, useEffect } from "react"
import _ from "lodash"

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
  yScaleDomain,
}) {
  const [state, setState] = useState({
    init: false,
  })
  const { init } = state

  const prevData = usePrevious(dataToCheck)
  const prevChartWidth = usePrevious(chartWidth)
  const prevChartHeight = usePrevious(chartHeight)
  const prevYScaleDomain = usePrevious(yScaleDomain)
  useEffect(() => {
    if (!init && chartHeight && chartWidth && data) {
      setState(prev => ({ ...prev, init: true }))
      initVis()
    }
    const sortFunc = (a, b) => (noKey ? a - b : a[sortKey] - b[sortKey])
    if (
      init &&
      prevData &&
      updateVisData &&
      (checkIfUpdated(dataToCheck.sort(sortFunc), prevData.sort(sortFunc)) ||
        !_.isEqual(prevYScaleDomain, yScaleDomain))
    ) {
      updateVisData && updateVisData()
    }
    if (
      init &&
      (updateVisDims || updateVisData) &&
      (chartWidth !== prevChartWidth || chartHeight !== prevChartHeight)
    ) {
      updateVisDims ? updateVisDims() : updateVisData && updateVisData()
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
    prevYScaleDomain,
    sortKey,
    updateVisData,
    updateVisDims,
    yScaleDomain,
  ])

  return state
}
