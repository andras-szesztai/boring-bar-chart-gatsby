import React, { useRef } from "react"

import { ChartWrapper, ChartSvg, ChartArea } from "../../atoms"
import { useDimensions } from "../../../hooks";
import useInitUpdate from "../../../hooks/useInitUpdate";

export default function VerticalDropChart({
  data, domain
}) {
  
  const wrapperRef = useRef()
  const svgRef = useRef()
  const areaRef = useRef()
  const { width, height, chartHeight, chartWidth } = useDimensions(
    wrapperRef
  );

  
  function initVis(){
    // const x = xAxis.range(0, chartWidth)
    console.log(domain)
    createUpdateCircles()
  }
  
  function createUpdateCircles(){
    // console.log(data)
  }
  
  const { init, runUpdate } = useInitUpdate({ data,  chartHeight, chartWidth, initVis})
  

  return (
    <ChartWrapper ref={wrapperRef}>
      <ChartSvg ref={svgRef} width={width} height={height}>
        <ChartArea ref={areaRef} />
      </ChartSvg>
    </ChartWrapper>
  )
}
