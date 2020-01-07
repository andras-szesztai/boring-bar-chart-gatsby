import React, { useRef } from "react"
import { ChartWrapper, ChartSvg, ChartArea } from "../../atoms"
import { useDimensions } from "../../../hooks";

export default function VerticalDropChart() {
  
  const wrapperRef = useRef()
  const svgRef = useRef()
  const areaRef = useRef()
  const { width, height, chartHeight, chartWidth } = useDimensions(
    wrapperRef
  );

  console.log(
    chartHeight, chartWidth
  )

  return (
    <ChartWrapper ref={wrapperRef}>
      <ChartSvg ref={svgRef} width={width} height={height}>
        <ChartArea ref={areaRef} />
      </ChartSvg>
    </ChartWrapper>
  )
}
