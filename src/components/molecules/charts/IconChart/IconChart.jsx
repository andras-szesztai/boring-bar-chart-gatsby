import React from "react"

import { ChartSvg, ChartArea, AxisLine } from "../../../atoms"
import { useChartRefs } from "../../../../hooks"

export default function IconChart({ dims }) {
  const { svgRef, yAxisRef } = useChartRefs()
  const margin = { top: 2, right: 2, bottom: 2, left: 2 }
  const chartHeight = dims - (margin.bottom + margin.top)
  const chartWidth = dims - (margin.left + margin.right)

  return (
    <ChartSvg ref={svgRef} height={dims} width={dims}>
      <ChartArea marginLeft={margin.left} marginTop={margin.top} ref={yAxisRef}>
        <AxisLine color="grayDarkest" stroke={.5} y1={0} y2={chartHeight} />
      </ChartArea>
    </ChartSvg>
  )
}
