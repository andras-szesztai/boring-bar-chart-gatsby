import React from "react"
import { select } from "d3-selection"
import chroma from "chroma-js"

import {
  COLORS,
  CIRCLE_ADJUST,
} from "../../../../../../../constants/moviesDashboard"

import { setRadius, getSelectedLineYPos } from "../utils"

export default function useActiveMovieIDUpdate({
  storedValues,
  activeMovieID,
  prevActiveMovieID,
  isSizeDynamic,
  chart,
  dims,
  setActiveMovie,
}) {
  React.useEffect(() => {
    if (storedValues.current.isInit && activeMovieID !== prevActiveMovieID) {
      const {
        chartArea,
        filteredData,
        currXScale,
        yScale,
        currSizeScale,
        voronoiArea,
      } = storedValues.current
      chartArea.select(".selected-circle").remove()
      chartArea.select(".selected-line").remove()
      const selectedData = filteredData.find(d => d.id === activeMovieID)
      if (selectedData) {
        chartArea.selectAll(".main-circle").each((d, i, n) => {
          if (d.id === activeMovieID) {
            const selection = select(n[i])
            selection
              .append("circle")
              .datum(selectedData)
              .attr("class", "selected-circle")
              .attr("cx", d => currXScale(new Date(d.release_date)))
              .attr("cy", d => yScale(d.vote_average))
              .attr("fill", "#fff")
              .attr("stroke", chroma(COLORS.secondary).darken())
              .attr("r", d =>
                setRadius({
                  adjust: CIRCLE_ADJUST,
                  isSizeDynamic,
                  currSizeScale,
                })(d)
              )
            chartArea.select(".selected-circle").lower()
            const isMainChart = chart === "main"
            selection
              .append("line")
              .datum(selectedData)
              .attr("class", "selected-line")
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
          }
        })
      }
      voronoiArea
        .selectAll(".voronoi-path")
        .on("click", setActiveMovie)
        .attr("cursor", d => (activeMovieID === d.id ? "default" : "pointer"))
    }
  })
}
