import React from "react"
import isEqual from "lodash/isEqual"

import {
  SIZE_RANGE,
  CIRCLE_ADJUST,
} from "../../../../../../../constants/moviesDashboard"
import { LINE_WIDTH } from "../Tooltip/Tooltip"

export default function useHoveredUpdate({
  storedValues,
  hoveredMovie,
  prevHoveredMovie,
  dims,
  mainData,
  addUpdateInteractions,
}) {
  React.useEffect(() => {
    if (
      storedValues.current.isInit &&
      hoveredMovie.id !== prevHoveredMovie.id
    ) {
      const { chartArea, currXScale } = storedValues.current
      const setX = d => currXScale(new Date(d.release_date))
      const isToTooltipTheRight = hoveredMovie.xPosition === 0
      const posAdjust = SIZE_RANGE[0] + CIRCLE_ADJUST
      if (hoveredMovie.id) {
        const isMain = !!mainData.find(d => isEqual(hoveredMovie.data, d))
        chartArea
          .selectAll(".hovered-circle")
          .datum(hoveredMovie.data)
          .attr("cx", setX)
          .attr("opacity", 1)
        chartArea
          .selectAll(".hovered-horizontal-line")
          .datum(hoveredMovie.data)
          .attr(
            "x1",
            d =>
              currXScale(new Date(d.release_date)) +
              (isToTooltipTheRight ? posAdjust : -posAdjust)
          )
          .attr(
            "x2",
            d =>
              currXScale(new Date(d.release_date)) +
              (isToTooltipTheRight
                ? posAdjust + LINE_WIDTH
                : -(posAdjust + LINE_WIDTH))
          )
          .attr("opacity", 1)
        if (isMain) {
          chartArea
            .select(".hovered-top-line")
            .datum(hoveredMovie.data)
            .attr("y2", -dims.height / 2)
            .attr("x1", setX)
            .attr("x2", setX)
            .attr("opacity", 1)
        } else {
          chartArea
            .select(".hovered-bottom-line")
            .datum(hoveredMovie.data)
            .attr("y2", dims.height / 2)
            .attr("x1", setX)
            .attr("x2", setX)
            .attr("opacity", 1)
        }
      }
      if (!hoveredMovie.id) {
        chartArea.selectAll(".hovered-circle").attr("opacity", 0)
        chartArea.selectAll(".hovered-line").attr("opacity", 0)
      }
      addUpdateInteractions()
    }
  })
}
