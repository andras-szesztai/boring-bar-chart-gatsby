import React, { useRef } from "react"
import { usePrevious } from "../../../hooks"
import { FlexContainer, ChartArea, ChartSvg } from "../../atoms"

export default function SimpleVerticalBarChart({
  data,
  highlightedValue,
  margin,
  width,
  height,
}) {
  
  const prevHighlightedValue = usePrevious(highlightedValue)

  const wrapperRef = useRef()
  const svgRef = useRef()
  const areaRef = useRef()

  return (
    <FlexContainer pos="relative" fullSize ref={wrapperRef}>
      <ChartSvg absPos ref={svgRef} width={width} height={height}>
        <ChartArea
          ref={areaRef}
          marginLeft={margin.left}
          marginTop={margin.top}
        />
      </ChartSvg>
    </FlexContainer>
  )
}

SimpleVerticalBarChart.defaultProps = {}
