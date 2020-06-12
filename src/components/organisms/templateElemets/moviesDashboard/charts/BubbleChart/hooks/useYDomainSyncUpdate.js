import { useEffect } from "react"
import { extent } from "d3-array"
import "d3-transition"

import { getSelectedLineYPos } from "../utils"
import { makeTransition } from "../../../../../../../utils/chartHelpers"
import { transition } from "../../../../../../../themes/theme"

export default function useYDomainSyncUpdate({
  storedValues,
  isYDomainSynced,
  prevIsYDomainSynced,
  isSizeDynamic,
  createUpdateVoronoi,
  chart,
  data
}) {
  useEffect(() => {
    if (
      storedValues.current.isInit &&
      isYDomainSynced !== prevIsYDomainSynced
    ) {
      const {
        yScale,
        chartArea,
        gridArea,
        currSizeScale,
      } = storedValues.current
      yScale.domain(
        isYDomainSynced ? [0, 10] : extent(data, d => d.vote_average)
      )
      const tChart = makeTransition(chartArea, transition.mdNum, "y-update")
      const tGrid = makeTransition(gridArea, transition.mdNum, "y-update")
      const setY = d => yScale(d)
      chartArea
        .selectAll(".main-circle circle")
        .transition(tChart)
        .attr("cy", ({ vote_average }) => yScale(vote_average))
      chartArea
        .select(".selected-line")
        .transition(tChart)
        .attr("y1", d =>
          getSelectedLineYPos({
            data: d,
            scales: { yScale, currSizeScale },
            props: { isSizeDynamic, chart },
          })
        )
      gridArea
        .selectAll(".grid-line")
        .transition(tGrid)
        .attr("y1", setY)
        .attr("y2", setY)
      gridArea
        .selectAll(".grid-text")
        .transition(tGrid)
        .attr("y", setY)
      createUpdateVoronoi()
      storedValues.current = {
        ...storedValues.current,
        yScale,
      }
    }
  }, [chart, createUpdateVoronoi, isSizeDynamic, storedValues, isYDomainSynced, prevIsYDomainSynced, data])
}
