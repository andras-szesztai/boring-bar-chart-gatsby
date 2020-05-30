import { useEffect } from "react"
import { extent } from "d3-array"
import gsap from "gsap"
import { select } from "d3-selection"

export default function useYDomainSyncUpdate({
  storedValues,
  props,
  prevProps,
  createUpdateVoronoi
}) {
  useEffect(() => {
    if (
      storedValues.current.isInit &&
      props.yDomainSynced !== prevProps.yDomainSynced
    ) {
      const { yScale, filteredData, svgArea } = storedValues.current
      yScale.domain(
        props.yDomainSynced
          ? [0, 10]
          : extent(filteredData, d => d.vote_average)
      )
      const sharedProps = { ease: "power2.inOut" }
      gsap.to(`.main-circle-${props.chart}`, {
        y: (i, el) =>
          yScale(select(el).datum().vote_average) - select(el).attr("cy"),
        ...sharedProps,
      })
      gsap.to(`.grid-line-${props.chart}`, {
        y: (i, el) => yScale(select(el).datum()) - select(el).attr("y1"),
        ...sharedProps,
      })
      gsap.to(`.grid-text-${props.chart}`, {
        y: (i, el) => yScale(select(el).datum()) - select(el).attr("y"),
        ...sharedProps,
      })
      createUpdateVoronoi()
      storedValues.current = {
        ...storedValues.current,
        yScale,
      }
    }
  }, [createUpdateVoronoi, prevProps, props, storedValues])
}
