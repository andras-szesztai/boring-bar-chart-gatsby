import { Delaunay } from "d3-delaunay"
import { getClassName } from "./chartHelpers"

export function createUpdateDelaunayCircles({
  data,
  dims,
  props,
  storedValues,
  functions,
}) {
  const { xKey, yKey, unitKey, hoverRadius } = props
  const { chartArea, xScale, yScale } = storedValues.current
  const {
    handleMouseover,
    handleMouseout,
    handleDelaunayClick,
  } = functions

  const setXPos = d => xScale(new Date(d[xKey]))
  const setYPos = d => yScale(d[yKey])
  const makeID = d => getClassName((d[unitKey] || yKey) + d[xKey])

  const delaunay = Delaunay.from(data, setXPos, setYPos).voronoi([
    0,
    0,
    dims.chartWidth,
    dims.chartHeight,
  ])

  chartArea
    .selectAll(".clip")
    .data(data)
    .join(
      enter =>
        enter
          .append("clipPath")
          .attr("class", "clip")
          .attr("id", d => `clip-${makeID(d)}`)
          .append("path")
          .attr("class", "clip-path-circle")
          .style("fill", "transparent")
          .attr("d", (_, i) => delaunay.renderCell(i))
          .call(enter => enter),
      update =>
        update.call(update =>
          update
            .attr("id", d => `clip-${makeID(d)}`)
            .select(".clip-path-circle")
            .attr("d", (_, i) => delaunay.renderCell(i))
        ),
      exit => exit.call(exit => exit.remove())
    )

  chartArea
    .selectAll(".catcher")
    .data(data)
    .join(
      enter =>
        enter
          .append("circle")
          .attr("class", "catcher")
          .attr("clip-path", d => `url(#clip-${makeID(d)})`)
          .attr("cx", setXPos)
          .attr("cy", setYPos)
          .attr("r", hoverRadius)
          .attr("fill", "black")
          .attr("opacity", 0.1)
          .style("pointer-events", "all")
          .on("mouseover", handleMouseover)
          .on("mouseout", handleMouseout)
          .on("click", handleDelaunayClick && handleDelaunayClick)
          .call(enter => enter),
      update =>
        update
          .attr("clip-path", d => `url(#clip-${makeID(d)})`)
          .on("mouseover", handleMouseover)
          .on("mouseout", handleMouseout)
          .on("click", handleDelaunayClick && handleDelaunayClick)
          .call(update =>
            update
              .attr("cx", setXPos)
              .attr("cy", setYPos)
              .attr("r", hoverRadius)
          ),
      exit => exit.call(exit => exit.remove())
    )
}
