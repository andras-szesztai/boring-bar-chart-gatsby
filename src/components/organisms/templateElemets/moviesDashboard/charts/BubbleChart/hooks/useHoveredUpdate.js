import React from "react"
import { select } from "d3-selection"
import chroma from "chroma-js"

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
      if (!hoveredMovie.id) {
        chartArea.select(".hovered-circle").remove()
        chartArea.select(".hovered-line").remove()
      }
      if (hoveredMovie.id) {
        chartArea.selectAll(".main-circle").each((d, i, n) => {
          if (d.id === hoveredMovie.id) {
            const selection = select(n[i])
            selection
              .append("circle")
              .datum(hoveredMovie.data)
              .attr("class", "hovered-circle")
              .attr("cx", d => currXScale(new Date(d.release_date)))
              .attr("cy", d => yScale(d.vote_average))
              .attr("fill", "#fff")
              .attr("stroke", chroma(COLORS.secondary).darken())
              .attr("stroke-dasharray", "2.5,2")
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
              .attr("x1", d => currXScale(new Date(d.release_date)))
              .attr("x2", d => currXScale(new Date(d.release_date)))
              .attr("y1", d =>
                getSelectedLineYPos({
                  data: d,
                  scales: { yScale, currSizeScale },
                  props: { isSizeDynamic, chart },
                })
              )
              .attr("y2", isMainChart ? dims.height : -dims.height)
              .attr("stroke", chroma(COLORS.secondary).darken())
              .attr("stroke-dasharray", "3,2")
          }
        })
      }
      addUpdateInteractions()
    }
  })
}