import React, { useState, useEffect } from "react"

import { FlexContainer, ChartWrapper, ChartSvg } from "../../../../../atoms"
import { useChartRefs, useDimensions } from "../../../../../../hooks"

export default function VerticalDoubleAreaChart({ margin, data }) {
  const { svgRef, wrapperRef } = useChartRefs()
  const dims = useDimensions({
    ref: wrapperRef,
    margin,
  })
  const [init, setInit] = useState(false)

  useEffect(() => {
    function createUpdateAxisLabels() {}
    function createUpdateAxisAreas() {}
  })

  return (
    <ChartWrapper areaRef={wrapperRef}>
      <ChartSvg
        absPos
        areaRef={svgRef}
        width={dims.width}
        height={dims.height}
      ></ChartSvg>
    </ChartWrapper>
  )
}
