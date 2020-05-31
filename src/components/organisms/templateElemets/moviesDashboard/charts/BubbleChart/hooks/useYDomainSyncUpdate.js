import { useEffect } from "react"
import { extent } from "d3-array"
import { getSelectedLineYPos } from "../utils"
import "d3-transition"

import { makeTransition } from "../../../../../../../utils/chartHelpers"

export default function useYDomainSyncUpdate({
  storedValues,
  props,
  prevProps,
  createUpdateVoronoi,
}) {
  const { yDomainSynced, chart, isSizeDynamic } = props
  useEffect(() => {
    if (
      storedValues.current.isInit &&
      yDomainSynced !== prevProps.yDomainSynced
    ) {
      const { yScale, filteredData, chartArea, gridArea } = storedValues.current
      yScale.domain(
        yDomainSynced ? [0, 10] : extent(filteredData, d => d.vote_average)
      )
      const t = makeTransition(chartArea, 500, "y-update")
      const setY = d => yScale(d)
      chartArea
        .selectAll(".main-circle circle")
        .transition(t)
        .attr("cy", ({ vote_average }) => yScale(vote_average))
      // chartArea
      //   .select(".selected-line")
      //   .transition(t)
      //   .attr("y1", d =>
      //     getSelectedLineYPos({
      //       data: d,
      //       scales: { yScale, currSizeScale },
      //       props: { isSizeDynamic, chart },
      //     })
      //   )
      gridArea
        .selectAll(".grid-line")
        .transition(t)
        .attr("y1", setY)
        .attr("y2", setY)
      gridArea
        .selectAll(".grid-text")
        .transition(t)
        .attr("y", setY)
      createUpdateVoronoi()
      storedValues.current = {
        ...storedValues.current,
        yScale,
      }
    }
  }, [
    chart,
    createUpdateVoronoi,
    isSizeDynamic,
    prevProps,
    props,
    storedValues,
    yDomainSynced,
  ])
}
