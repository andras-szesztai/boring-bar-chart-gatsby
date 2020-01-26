import { useState, useEffect } from "react"

import usePrevious from "./usePrevious"
import { checkIfUpdated } from "../utils/chartHelpers"

export default function useInitUpdate({
  data,
  chartHeight,
  chartWidth,
  initVis,
  updateVisData,
  sortKey,
  noKey
}) {
  const [state, setState] = useState({
    init: false
  })
  const { init, runUpdate } = state

  const prevData = usePrevious(data)
  useEffect(() => {
    if (!init && chartHeight && chartWidth && data) {
      setState(prev => ({ ...prev, init: true }))
      initVis()
    }
    const sortFunc  = (a, b) => noKey ? a - b : a[sortKey] - b[sortKey]
    if(init && prevData && checkIfUpdated(data.sort(sortFunc), prevData.sort(sortFunc))){
      updateVisData()
    }
  }, [chartHeight, chartWidth, data, init, initVis, noKey, prevData, sortKey, state, updateVisData])

  

  return state
}
