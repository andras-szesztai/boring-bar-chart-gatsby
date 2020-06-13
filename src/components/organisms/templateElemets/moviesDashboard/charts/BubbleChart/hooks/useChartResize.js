import { useEffect } from "react"
import isEqual from "lodash/isEqual"
import { getSelectedLineYPos } from "../utils"

export default function useChartResize({
  dims,
  prevDims,
  storedValues,
  margin,
  createUpdateVoronoi,
  chart,
  isSizeDynamic,
  setXScale
}) {
  useEffect(() => {
    if (storedValues.current.isInit && !isEqual(dims, prevDims)) {
      const {
        currXScale,
        yScale,
        chartArea,
        gridArea,
        currSizeScale,
      } = storedValues.current
      currXScale.range([0, dims.width - margin.left - margin.right])
      yScale.range([dims.height - margin.top - margin.bottom, 0])
      storedValues.current = {
        ...storedValues.current,
        currXScale,
        yScale,
      }
      chartArea
        .selectAll(".main-circle")
        .selectAll("circle")
        .attr("cx", ({ unified_year }) => currXScale(new Date(unified_year)))
        .attr("cy", ({ vote_average }) => yScale(vote_average))
      const isMainChart = chart === "main"
      chartArea
        .select(".selected-line")
        .attr("x1", d => currXScale(new Date(d.unified_year)))
        .attr("x2", d => currXScale(new Date(d.unified_year)))
        .attr("y1", d =>
          getSelectedLineYPos({
            data: d,
            scales: { yScale, currSizeScale },
            props: { isSizeDynamic, chart },
          })
        )
        .attr("y2", isMainChart ? dims.height : -dims.height)
      gridArea
        .selectAll(".grid-line")
        .attr("x2", dims.width)
        .attr("y1", d => yScale(d))
        .attr("y2", d => yScale(d))
      gridArea
        .selectAll(".grid-text")
        .attr("x", dims.width - margin.left)
        .attr("y", d => storedValues.current.yScale(d))
      createUpdateVoronoi()
    }
  }, [chart, createUpdateVoronoi, dims, isSizeDynamic, margin, prevDims, setXScale, storedValues])
}
