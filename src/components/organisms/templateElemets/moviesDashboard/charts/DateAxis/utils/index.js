import {
  SIZE_RANGE,
  CIRCLE_ADJUST,
} from "../../../../../../../constants/moviesDashboard"

export function showRefElements({
  storedValues,
  activeMovieID,
  filteredData,
  mainData,
  subData,
  height,
}) {
  const { currXScale, chartArea, voronoiArea } = storedValues.current
  const setX = d => d && currXScale(new Date(d.unified_year))
  const selectedCircleData = filteredData.find(d => d.id === activeMovieID)
  chartArea
    .selectAll(".selected-circle")
    .datum(selectedCircleData)
    .attr("cx", setX)
    .attr("opacity", 1)
  const topLineData = mainData.filter(d => d.id === activeMovieID)
  const bottomLineData = subData.filter(d => d.id === activeMovieID)
  chartArea
    .selectAll(".selected-line")
    .datum(selectedCircleData)
    .attr("x1", setX)
    .attr("x2", setX)
    .attr("opacity", 1)
  if (topLineData.length) {
    chartArea.selectAll(".selected-top-line").attr("y2", -height / 2)
  } else {
    chartArea
      .selectAll(".selected-top-line")
      .attr("y2", -SIZE_RANGE[0] - CIRCLE_ADJUST)
  }
  if (bottomLineData.length) {
    chartArea.selectAll(".selected-bottom-line").attr("y2", height / 2)
  } else {
    chartArea
      .selectAll(".selected-bottom-line")
      .attr("y2", SIZE_RANGE[0] + CIRCLE_ADJUST)
  }
  voronoiArea
    .selectAll(".voronoi-path")
    .attr("cursor", d => (activeMovieID === d.id ? "default" : "pointer"))
}
