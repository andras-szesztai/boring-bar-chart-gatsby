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
      if (activeMovieID) {
        const selectedCircleData = filteredData.find(
          d => d.id === activeMovieID
        )
        chartArea
          .selectAll("circle")
          .datum(selectedCircleData)
          .transition(t)
          .attr("cx", ({ release_date }) => currXScale(new Date(release_date)))
          .attr("opacity", 1)
        const isCast = type === "cast"
        const mainData = isCast ? data.castData : data.crewData
        const subData = isCast ? data.crewData : data.castData
        const topLineData = mainData.filter(d => d.id === activeMovieID)
        const bottomLineData = subData.filter(d => d.id === activeMovieID)
        chartArea
          .selectAll(".line")
          .datum(selectedCircleData)
          .transition(t)
          .attr("x1", ({ release_date }) => currXScale(new Date(release_date)))
          .attr("x2", ({ release_date }) => currXScale(new Date(release_date)))
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
