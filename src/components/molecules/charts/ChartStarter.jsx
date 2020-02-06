import React from "react"
import { FlexContainer, ChartSvg, ChartArea } from "../../atoms"

export default function({ refs, dims, margin, withXAxis, axisBottom }) {
  const { wrapperRef, svgRef, areaRef, xAxisRef } = refs
  const { height, width } = dims
  const { left, top } = margin

  return (
    <FlexContainer pos="relative" fullSize ref={wrapperRef}>
      <ChartSvg absPos ref={svgRef} width={width} height={height}>
        <ChartArea ref={areaRef} marginLeft={left} marginTop={top}>
          {withXAxis && (
            <ChartArea
              ref={xAxisRef}
              marginLeft={0}
              marginTop={axisBottom ? dims.chartHeight : 0}
            />
          )}
        </ChartArea>
      </ChartSvg>
    </FlexContainer>
  )
}
