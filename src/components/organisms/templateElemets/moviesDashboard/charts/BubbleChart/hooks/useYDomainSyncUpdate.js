import { useEffect } from "react"
import { extent } from "d3-array"
import gsap from "gsap"
import { select } from "d3-selection"
import { setRadius } from "../utils"

export default function useYDomainSyncUpdate({
  storedValues,
  props: { yDomainSynced, chart, isSizeDynamic },
  prevProps,
  createUpdateVoronoi,
}) {
  useEffect(() => {
    if (
      storedValues.current.isInit &&
      yDomainSynced !== prevProps.yDomainSynced
    ) {
      const { yScale, filteredData, chartArea, currSizeScale } = storedValues.current
      yScale.domain(
        yDomainSynced ? [0, 10] : extent(filteredData, d => d.vote_average)
      )
      const sharedProps = { ease: "power2.inOut" }
      gsap.to(`.main-circle-${chart} circle`, {
        y: (i, el) =>
          yScale(select(el).datum().vote_average) - select(el).attr("cy"),
        ...sharedProps,
      })
      gsap.to(`.grid-line-${chart}`, {
        y: (i, el) => yScale(select(el).datum()) - select(el).attr("y1"),
        ...sharedProps,
      })
      gsap.to(`.grid-text-${chart}`, {
        y: (i, el) => yScale(select(el).datum()) - select(el).attr("y"),
        ...sharedProps,
      })
      chartArea
        .selectAll(".selected-line")
        .transition()
        .attr("y1", d =>
          chart === "main"
            ? yScale(d.vote_average) +
              setRadius({ adjust: 4, isSizeDynamic, currSizeScale })(d)
            : yScale(d.vote_average) -
              setRadius({ adjust: 4, isSizeDynamic, currSizeScale })(d)
        )
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
    storedValues,
    yDomainSynced,
  ])
}
