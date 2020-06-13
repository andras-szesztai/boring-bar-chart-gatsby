import { select } from "d3-selection"
import chroma from "chroma-js"

import {
  COLORS,
  CIRCLE_ADJUST,
} from "../../../../../../../constants/moviesDashboard"

export const setRadius = ({ adjust = 0, isSizeDynamic, currSizeScale }) => d =>
  isSizeDynamic ? currSizeScale(d.vote_count) + adjust : 6 + adjust

export const getSelectedLineYPos = ({
  data,
  scales: { yScale, currSizeScale },
  props: { isSizeDynamic, chart },
}) => {
  return chart === "main"
    ? yScale(data.vote_average) +
        setRadius({ adjust: 4, isSizeDynamic, currSizeScale })(data)
    : yScale(data.vote_average) -
        setRadius({ adjust: 4, isSizeDynamic, currSizeScale })(data)
}

export function createRefElements({
  data,
  activeMovieID,
  storedValues,
  chart,
  isSizeDynamic,
  height,
}) {
  const selectedData = data.find(d => d.id === activeMovieID)
  const {
    chartArea,
    currXScale,
    yScale,
    currSizeScale,
    voronoiArea,
  } = storedValues.current
  if (selectedData) {
    chartArea.selectAll(".main-circle").each((d, i, n) => {
      if (d.id === activeMovieID) {
        const selection = select(n[i])
        selection
          .append("circle")
          .datum(selectedData)
          .attr("class", "selected-circle")
          .attr("cx", d => currXScale(new Date(d.unified_year)))
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
          .attr("x1", d => currXScale(new Date(d.unified_year)))
          .attr("x2", d => currXScale(new Date(d.unified_year)))
          .attr("y1", d =>
            getSelectedLineYPos({
              data: d,
              scales: { yScale, currSizeScale },
              props: { isSizeDynamic, chart },
            })
          )
          .attr("y2", isMainChart ? height : -height)
          .attr("stroke", chroma(COLORS.secondary).darken())
      }
    })
  }
  voronoiArea
    .selectAll(".voronoi-path")
    .attr("cursor", d => (activeMovieID === d.id ? "default" : "pointer"))
}
