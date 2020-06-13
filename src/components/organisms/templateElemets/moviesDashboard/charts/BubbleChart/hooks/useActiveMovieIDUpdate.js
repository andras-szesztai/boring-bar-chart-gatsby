import React from "react"

import { createRefElements } from "../utils"

export default function useActiveMovieIDUpdate({
  storedValues,
  activeMovieID,
  prevActiveMovieID,
  isSizeDynamic,
  chart,
  dims,
  data,
}) {
  React.useEffect(() => {
    if (storedValues.current.isInit && activeMovieID !== prevActiveMovieID) {
      const { chartArea } = storedValues.current
      chartArea.select(".selected-circle").remove()
      chartArea.select(".selected-line").remove()
      chartArea.select(".hovered-circle").remove()
      chartArea.select(".hovered-line").remove()
      createRefElements({
        data,
        activeMovieID,
        storedValues,
        chart,
        isSizeDynamic,
        height: dims.height,
      })
    }
  })
}
