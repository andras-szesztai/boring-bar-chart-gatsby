import React from "react"
import { select } from "d3-selection"
import isEqual from "lodash/isEqual"

import {
  COLORS,
  CIRCLE_ADJUST,
} from "../../../../../../../constants/moviesDashboard"

import { setRadius, getSelectedLineYPos } from "../utils"

export default function useHoveredUpdate({
  storedValues,
  isSizeDynamic,
  hoveredMovie,
  prevHoveredMovie,
  chart,
  dims,
  addUpdateInteractions,
}) {
  React.useEffect(() => {
    if (
      storedValues.current.isInit &&
      hoveredMovie.id !== prevHoveredMovie.id
    ) {
      const {
        chartArea,
        currXScale,
        yScale,
        currSizeScale,
      } = storedValues.current
      chartArea.select(".hovered-circle").remove()
      chartArea.select(".hovered-line").remove()
      if (hoveredMovie.id) {
        chartArea.selectAll(".main-circle").each((d, i, n) => {
          if (isEqual(d, hoveredMovie.data)) {
            const selection = select(n[i])
            const setX = ({ unified_date }) =>
              currXScale(new Date(unified_date))
            selection
              .append("circle")
              .datum(hoveredMovie.data)
              .attr("class", "hovered-circle")
              .attr("cx", setX)
              .attr("cy", d => yScale(d.vote_average))
              .attr("fill", "#fff")
              .attr("stroke", COLORS.secondary)
              .attr("r", d =>
                setRadius({
                  adjust: CIRCLE_ADJUST,
                  isSizeDynamic,
                  currSizeScale,
                })(d)
              )
            chartArea.select(".hovered-circle").lower()
            const isMainChart = chart === "main"
            selection
              .append("line")
              .datum(hoveredMovie.data)
              .attr("class", "hovered-line")
              .attr("x1", setX)
              .attr("x2", setX)
              .attr("y1", d =>
                getSelectedLineYPos({
                  data: d,
                  scales: { yScale, currSizeScale },
                  props: { isSizeDynamic, chart },
                })
              )
              .attr("y2", isMainChart ? dims.height : -dims.height)
              .attr("stroke", COLORS.secondary)
          }
        })
      }
      addUpdateInteractions()
    }
  })
}
