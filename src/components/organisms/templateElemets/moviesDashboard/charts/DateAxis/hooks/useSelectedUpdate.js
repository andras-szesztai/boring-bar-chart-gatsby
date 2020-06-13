import React from "react"

import {
  SIZE_RANGE,
  CIRCLE_ADJUST,
} from "../../../../../../../constants/moviesDashboard"

export default function useSelectedUpdate({
  storedValues,
  activeMovieID,
  prevActiveMovieID,
  data,
  dims,
}) {
  React.useEffect(() => {
    if (storedValues.current.isInit && activeMovieID !== prevActiveMovieID) {
      const {
        chartArea,
        filteredData,
        currXScale,
        voronoiArea,
      } = storedValues.current
      const setX = d => currXScale(new Date(d.unified_year))
      if (activeMovieID) {
        const selectedCircleData = filteredData.find(
          d => d.id === activeMovieID
        )
        chartArea
          .selectAll(".selected-circle")
          .datum(selectedCircleData)
          .attr("cx", setX)
          .attr("opacity", 1)
        const topLineData = data.mainData.filter(d => d.id === activeMovieID)
        const bottomLineData = data.subData.filter(d => d.id === activeMovieID)
        chartArea
          .selectAll(".selected-line")
          .datum(selectedCircleData)
          .attr("x1", setX)
          .attr("x2", setX)
          .attr("opacity", 1)
        if (topLineData.length) {
          chartArea.selectAll(".selected-top-line").attr("y2", -dims.height / 2)
        } else {
          chartArea
            .selectAll(".selected-top-line")
            .attr("y2", -SIZE_RANGE[0] - CIRCLE_ADJUST)
        }
        if (bottomLineData.length) {
          chartArea
            .selectAll(".selected-bottom-line")
            .attr("y2", dims.height / 2)
        } else {
          chartArea
            .selectAll(".selected-bottom-line")
            .attr("y2", SIZE_RANGE[0] + CIRCLE_ADJUST)
        }
      }
      if (!activeMovieID) {
        chartArea.selectAll(".selected-circle").attr("opacity", 0)
        chartArea.selectAll(".selected-line").attr("opacity", 0)
      }
      voronoiArea
        .selectAll(".voronoi-path")
        .attr("cursor", d => (activeMovieID === d.id ? "default" : "pointer"))
    }
  })
}
