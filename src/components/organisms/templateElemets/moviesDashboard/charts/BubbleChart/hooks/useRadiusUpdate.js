import { useEffect } from "react"
import { easeCubicInOut } from "d3-ease"
import { mean } from "d3-array"

export default function({ storedValues, props, prevProps }) {
  useEffect(() => {
    if (
      storedValues.current.isInit &&
      props.isSizeDynamic !== prevProps.isSizeDynamic
    ) {
      const { currSizeScale, chartArea } = storedValues.current
      chartArea
        .selectAll(`.main-circle-${props.chart} .circle`)
        .transition()
        .ease(easeCubicInOut)
        .attr("r", ({ vote_count }) =>
          props.isSizeDynamic
            ? currSizeScale(vote_count)
            : mean(props.sizeRange) / 2
        )
      chartArea
        .select(".selected-circle")
        .transition()
        .attr(
          "r", d =>
          props.isSizeDynamic
            ? currSizeScale(d.vote_count) + 4
            : mean(props.sizeRange) / 2 + 4
        )
    }
  }, [prevProps, props, storedValues])
}
