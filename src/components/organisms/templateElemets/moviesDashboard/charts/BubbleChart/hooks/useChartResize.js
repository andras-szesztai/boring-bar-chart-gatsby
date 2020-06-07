import { useEffect } from "react"
import isEqual from "lodash/isEqual"

export default function useChartResize({
  dims,
  prevDims,
  storedValues,
  margin,
  createUpdateVoronoi
}) {
  useEffect(() => {
    if (storedValues.current.isInit && !isEqual(dims, prevDims)) {
      const { currXScale, yScale, chartArea, gridArea } = storedValues.current
      currXScale.range([0, dims.width - margin.left - margin.right])
      yScale.range([dims.height - margin.top - margin.bottom, 0])
      storedValues.current = {
        ...storedValues.current,
        currXScale,
        yScale,
      }
      chartArea
        .selectAll(".main-circle")
        .select("circle")
        .attr("cx", ({ release_date }) => currXScale(new Date(release_date)))
        .attr("cy", ({ vote_average }) => yScale(vote_average))
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
  }, [createUpdateVoronoi, dims, margin, prevDims, storedValues])
}
