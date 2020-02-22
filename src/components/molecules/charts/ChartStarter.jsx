import React from "react"
import { ChartWrapper, ChartSvg, ChartArea } from "../../atoms"

export default function ChartStarter({
  refs,
  dims,
  margin,
  withXAxis,
  axisBottom,
  fontSize,
}) {
  const { wrapperRef, svgRef, areaRef, xAxisRef } = refs
  const { height, width } = dims
  const { left, top } = margin

  return (
    <ChartWrapper ref={wrapperRef} fontSize={fontSize}>
      <ChartSvg absPos ref={svgRef} width={width} height={height}>
        {withXAxis && (
          <ChartArea
            ref={xAxisRef}
            marginLeft={0}
            marginTop={axisBottom ? top + dims.chartHeight : top}
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
