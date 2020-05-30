import { useEffect, useRef } from "react"
import { extent } from "d3-array"
import gsap from "gsap"
import { select } from "d3-selection"
import { getSelectedLineYPos } from "../utils"

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
      const { yScale, filteredData, currSizeScale } = storedValues.current
      yScale.domain(
        yDomainSynced ? [0, 10] : extent(filteredData, d => d.vote_average)
      )
      const sharedProps = { ease: "power2.inOut" }
      gsap.to(`.main-circle-${chart} circle`, {
        y: (i, el) =>
          yScale(select(el).datum().vote_average) - select(el).attr("cy"),
        ...sharedProps,
      })
      gsap.to(`.selected-line-${chart}`, {
        y: (i, el) =>
          getSelectedLineYPos({
            data: select(el).datum(),
            scales: { yScale, currSizeScale },
            props: { isSizeDynamic, chart },
          }) - select(el).attr("y1"),
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
