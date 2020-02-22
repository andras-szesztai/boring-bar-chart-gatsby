import React, { useRef } from "react"
import { scaleBand } from "d3-scale"
import { select } from "d3-selection"
import chroma from "chroma-js"
import "d3-transition"

import { ChartStarter } from "../../molecules/charts"
import { useChartRefs, useDimensions, useInitUpdate } from "../../../hooks"

export default function HorizontalLinearGradient({
  data,
  margin
}) {
  const refs = useChartRefs()
  const valueStore = useRef()
  const dims = useDimensions({
    ref: refs.wrapperRef,
    margin,
  })

  function initVis() {
   
  }

  const { init } = useInitUpdate({
    data: data && Object.values(data),
    chartHeight: dims.chartHeight,
    chartWidth: dims.chartWidth,
    initVis,
  })

  return (
    <>
      <ChartStarter
        refs={refs}
        dims={dims}
        margin={margin}
        withXAxis
        axisBottom
        fontSize={0}
      />
    </>
  )
}

HorizontalLinearGradient.defaultProps = {
  margin: { top: 10, bottom: 10, left: 10, right: 10 },
}
