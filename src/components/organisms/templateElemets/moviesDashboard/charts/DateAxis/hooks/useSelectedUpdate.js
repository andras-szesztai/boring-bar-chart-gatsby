import React from "react"

import { makeTransition } from "../../../../../../../utils/chartHelpers"
import {
  SIZE_RANGE,
  CIRCLE_ADJUST,
} from "../../../../../../../constants/moviesDashboard"

export default function useSelectedUpdate({
  storedValues,
  activeMovieID,
  prevActiveMovieID,
  type,
  data,
  dims,
}) {
  React.useEffect(() => {
    if (storedValues.current.isInit && activeMovieID !== prevActiveMovieID) {
      const { chartArea, filteredData, currXScale } = storedValues.current
      const t = makeTransition(chartArea, 500, "y-update")
      const setX = d => currXScale(new Date(d.release_date))
      if (activeMovieID) {
        const selectedCircleData = filteredData.find(
          d => d.id === activeMovieID
        )
        if (!Number(chartArea.selectAll(".line").attr("opacity"))) {
          // First time no animation for x
          chartArea
            .selectAll(".line")
            .datum(selectedCircleData)
            .attr("x1", setX)
            .attr("x2", setX)
          chartArea
            .selectAll("circle")
            .datum(selectedCircleData)
            .attr("cx", setX)
        }
        chartArea
          .selectAll("circle")
          .datum(selectedCircleData)
          .transition(t)
          .attr("cx", setX)
          .attr("opacity", 1)
        const topLineData = data.mainData.filter(d => d.id === activeMovieID)
        const bottomLineData = data.subData.filter(d => d.id === activeMovieID)
        chartArea
          .selectAll(".line")
          .datum(selectedCircleData)
          .transition(t)
          .attr("x1", setX)
          .attr("x2", setX)
          .attr("opacity", 1)
        if (topLineData.length) {
          chartArea
            .selectAll(".top-line")
            .transition(t)
            .attr("y2", -dims.height / 2)
        } else {
          chartArea
            .selectAll(".top-line")
            .transition(t)
            .attr("y2", -SIZE_RANGE[0] - CIRCLE_ADJUST)
        }
        if (bottomLineData.length) {
          chartArea
            .selectAll(".bottom-line")
            .transition(t)
            .attr("y2", dims.height / 2)
        } else {
          chartArea
            .selectAll(".bottom-line")
            .transition(t)
            .attr("y2", SIZE_RANGE[0] + CIRCLE_ADJUST)
        }
      }
      if (!activeMovieID) {
        chartArea
          .selectAll("circle")
          .transition(t)
          .attr("opacity", 0)
        chartArea
          .selectAll(".line")
          .transition(t)
          .attr("opacity", 0)
      }
    }
  })
}
