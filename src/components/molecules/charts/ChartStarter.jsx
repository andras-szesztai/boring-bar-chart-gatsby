import React from "react"
import { ChartWrapper, ChartSvg, ChartArea } from "../../atoms"

export default function ChartStarter({
  refs,
  dims,
  margin,
  withXAxis,
  withYAxis,
  axisBottom,
  axisLeft,
  fontSize,
}) {
  const { wrapperRef, svgRef, areaRef, xAxisRef, yAxisRef } = refs
  const { height, width } = dims
  const { left, top } = margin

  return (
    <ChartWrapper areaRef={wrapperRef} fontSize={fontSize}>
      <ChartSvg absPos areaRef={svgRef} width={width} height={height}>
        {withXAxis && (
          <ChartArea
            areaRef={xAxisRef}
            marginLeft={left}
            marginTop={axisBottom ? top + dims.chartHeight : top}
          />
        )}
        {withYAxis && (
          <ChartArea
            areaRef={yAxisRef}
            marginLeft={axisLeft ? left : dims.chartWidth + left}
            marginTop={top}
          />
        )}
        <ChartArea areaRef={areaRef} marginLeft={left} marginTop={top} />
      </ChartSvg>
    </ChartWrapper>
  )
}

ChartStarter.defaultProps = {
  margin: {},
}
