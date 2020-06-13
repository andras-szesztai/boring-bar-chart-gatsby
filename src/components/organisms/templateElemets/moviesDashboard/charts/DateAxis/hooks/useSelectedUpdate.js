import React from "react"

import { showRefElements } from "../utils"

export default function useSelectedUpdate({
  storedValues,
  activeMovieID,
  prevActiveMovieID,
  data,
  dims,
}) {
  React.useEffect(() => {
    if (storedValues.current.isInit && activeMovieID !== prevActiveMovieID) {
      const { chartArea, filteredData, voronoiArea } = storedValues.current
      showRefElements({
        storedValues,
        activeMovieID,
        filteredData,
        mainData: data.mainData,
        subData: data.subData,
        height: dims.height,
      })
      if (!activeMovieID) {
        chartArea.selectAll(".selected-circle").attr("opacity", 0)
        chartArea.selectAll(".selected-line").attr("opacity", 0)
        voronoiArea.selectAll(".voronoi-path").attr("cursor", "pointer")
      }
    }
  })
}
