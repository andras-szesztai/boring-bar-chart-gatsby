import { useEffect } from "react"
import { easeCubicInOut } from "d3-ease"

import { setRadius } from "../utils"

export default function({
  storedValues,
  props: { chart, isSizeDynamic },
  prevProps,
}) {
  useEffect(() => {
    if (
      storedValues.current.isInit &&
      isSizeDynamic !== prevProps.isSizeDynamic
    ) {
      const { currSizeScale, chartArea } = storedValues.current
      chartArea
        .selectAll(`.main-circle-${chart} .circle`)
        .transition()
        .ease(easeCubicInOut)
        .attr("r", d => setRadius({ isSizeDynamic, currSizeScale })(d))
      chartArea
        .select(".selected-circle")
        .transition()
        .attr("r", d =>
          setRadius({ adjust: 4, isSizeDynamic, currSizeScale })(d)
        )
    }
  }, [chart, isSizeDynamic, prevProps, storedValues])
}
