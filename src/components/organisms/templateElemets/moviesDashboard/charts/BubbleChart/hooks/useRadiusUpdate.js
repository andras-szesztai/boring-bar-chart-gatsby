import { useEffect } from "react"
import { easeCubicInOut } from "d3-ease"

import { setRadius, getSelectedLineYPos } from "../utils"

export default function({
  storedValues,
  chart,
  isSizeDynamic,
  prevIsSizeDynamic,
}) {
  useEffect(() => {
    if (storedValues.current.isInit && isSizeDynamic !== prevIsSizeDynamic) {
      const { currSizeScale, chartArea, yScale } = storedValues.current
      chartArea
        .selectAll(".main-circle circle")
        .transition()
        .ease(easeCubicInOut)
        .attr("r", d => setRadius({ isSizeDynamic, currSizeScale })(d))
      chartArea
        .select(".selected-circle")
        .transition()
        .ease(easeCubicInOut)
        .attr("r", d =>
          setRadius({ adjust: 4, isSizeDynamic, currSizeScale })(d)
        )
      chartArea
        .select(".selected-line")
        .transition()
        .ease(easeCubicInOut)
        .attr("y1", d =>
          getSelectedLineYPos({
            data: d,
            scales: { yScale, currSizeScale },
            props: { isSizeDynamic, chart },
          })
        )
    }
  }, [chart, isSizeDynamic, prevIsSizeDynamic, storedValues])
}
