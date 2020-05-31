import React from "react"
import { select } from "d3-selection"
import chroma from "chroma-js"

import { setRadius, getSelectedLineYPos } from "../utils"
import { COLORS } from "../../../../../../../constants/moviesDashboard"

export default function useActiveMovieIDUpdate({
  storedValues,
  activeMovieID,
  prevActiveMovieID,
  isSizeDynamic,
  chart,
  dims,
}) {
  React.useEffect(() => {
    if (storedValues.current.isInit && activeMovieID !== prevActiveMovieID) {
      const {
        chartArea,
        filteredData,
        currXScale,
        yScale,
        currSizeScale,
      } = storedValues.current
      chartArea.selectAll(".selected-circle").remove()
      chartArea.selectAll(".selected-line").remove()
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
              .attr("fill", "transparent")
              .attr("stroke", chroma(COLORS.secondary).darken())
              .attr("r", d =>
                setRadius({ adjust: 4, isSizeDynamic, currSizeScale })(d)
              )
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
    }
  })
}
