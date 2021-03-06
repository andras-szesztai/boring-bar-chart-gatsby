import { Delaunay } from "d3-delaunay"
import { axisTop, axisRight, axisBottom, axisLeft } from "d3-axis"

import { getClassName, changedFormat } from "./chartHelpers"
import { space, colors } from "../themes/theme"


export const makeGridStyle = g => {
    g.select(".domain").remove()
    g.selectAll(".tick text").remove()
    g.selectAll(".tick line")
      .attr("stroke", colors.grayDarkest)
      .attr("stroke-opacity", 0.25)
      .attr("stroke-width", 0.5)
  }

export function createUpdateDelaunayCircles({
  data,
  dims,
  props,
  storedValues,
  functions,
}) {
  const { xKey, yKey, unitKey, hoverRadius } = props
  const { chartArea, xScale, yScale } = storedValues.current
  const { handleMouseover, handleMouseout, handleDelaunayClick } = functions

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
          .attr("opacity", 0)
          .style("pointer-events", "all")
          .on("mouseover", handleMouseover)
          .on("mouseout", handleMouseout)
          .on(
            "click",
            handleDelaunayClick ? handleDelaunayClick : handleMouseover
          )
          .call(enter => enter),
      update =>
        update
          .attr("clip-path", d => `url(#clip-${makeID(d)})`)
          .on("mouseover", handleMouseover)
          .on("mouseout", handleMouseout)
          .on(
            "click",
            handleDelaunayClick ? handleDelaunayClick : handleMouseover
          )
          .call(update =>
            update
              .attr("cx", setXPos)
              .attr("cy", setYPos)
              .attr("r", hoverRadius)
          ),
      exit => exit.call(exit => exit.remove())
    )
}

export function createUpdateAxis({
  selector,
  scale,
  type,
  duration,
  isGrid,
  noTicks,
  tickSize,
  isDateAxis,
  metricIsPercentage,
  prefix,
  suffix,
}) {
  const axesTypes = {
    top: axisTop(scale),
    right: axisRight(scale),
    bottom: axisBottom(scale),
    left: axisLeft(scale),
  }

  const chartDim = Math.max(...scale.range())
  const emptyIfFalse = prop => (prop ? prop : "")

  const axisCall = axesTypes[type]
    .ticks((chartDim / 100).toFixed(0))
    .tickSizeOuter(0)
    .tickSizeInner(isGrid ? tickSize : space[1])

  selector
    .transition()
    .duration(duration)
    .call(
      isDateAxis || isGrid
        ? axisCall
        : axisCall.tickFormat(
            d =>
              emptyIfFalse(prefix) +
              changedFormat(d, metricIsPercentage) +
              emptyIfFalse(suffix)
          )
    )

  formatAxisGrid({ selector, isGrid, noTicks })

  function formatAxisGrid({ selector }) {

    selector.selectAll(".domain").remove()
    // if (isGrid) {
    //   texts.remove()
    //   setStyles(ticks, colors.gray, opacity.grid)
    // }
    // if (!isGrid) {
    //   texts.style("fill", colors.gray).attr("font-size", fontSize[1])
    //   ticks.style("stroke", colors.gray).attr("opacity", 1)
    // }
    // if (noTicks) {
    //   ticks.remove()
    // }
  }
}


export const makeIconColorTransitionProps = (attr, color) => ({
  initial: { [attr]: color },
  animate: {
    [attr]: color,
  },
  transition: {
    duration: 0.3,
  },
})