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
    <ChartWrapper ref={wrapperRef} fontSize={fontSize}>
      <ChartSvg absPos ref={svgRef} width={width} height={height}>
        {withXAxis && (
          <ChartArea
            ref={xAxisRef}
            marginLeft={left}
            marginTop={axisBottom ? top + dims.chartHeight : top}
          />
        )}
        {withYAxis && (
          <ChartArea
            ref={yAxisRef}
            marginLeft={axisLeft ? left : dims.chartWidth + left}
            marginTop={top}
          />
        )}
        <ChartArea ref={areaRef} marginLeft={left} marginTop={top} />
      </ChartSvg>
    </ChartWrapper>
  )
}

ChartStarter.defaultProps = {
  margin: {},
}
