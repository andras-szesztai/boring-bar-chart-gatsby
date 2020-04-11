import React, { useState, useEffect, useRef } from "react"
import _ from "lodash"
import { select } from "d3-selection"
import { scaleLinear } from "d3-scale"
import { max, min, extent } from "d3-array"
import { axisLeft, axisTop, axisBottom } from "d3-axis"
import chroma from "chroma-js"

import {
  ChartWrapper,
  ChartSvg,
  ChartArea,
  AxisLine,
  FlexContainer,
  Container,
} from "../../../../atoms"
import { useChartRefs, useDimensions, usePrevious } from "../../../../../hooks"
import { space } from "../../../../../themes/theme"
import { makeAreaData } from "../utils/dataHelpers"

export default function AreaChart({
  margin,
  data,
  language,
  averages,
  fullListDomain,
}) {
  const { svgRef, wrapperRef, areaRef } = useChartRefs()
  const storedValues = useRef()
  const dims = useDimensions({
    ref: wrapperRef,
    margin,
  })
  const [init, setInit] = useState(false)
  const prevData = usePrevious(data)
  const prevAverages = usePrevious(averages)
  const [areaDataSets, setAreaDataSets] = useState({})
  const prevAreaDataSets = usePrevious(areaDataSets)

  useEffect(() => {
    if (!init && data) {
      const areaData = makeAreaData(data, fullListDomain.fullAgeList)
      const xScale = scaleLinear()
        .range([0, dims.chartWidth])
        .domain(fullListDomain.fullAgeDomain)
      const yScale = scaleLinear()
        .range([0, dims.chartHeight])
        .domain([fullListDomain.maxNumber, 0])
    }
    if (init && prevData.length !== data.length) {
      const areaData = makeAreaData(data, fullListDomain.fullList)
    }
  })

  useEffect(() => {})

  return (
    <ChartWrapper areaRef={wrapperRef}>
      {/* <FlexContainer
        absPos
        left={dims.width / 2 - (language === "hu" ? 50 : 54)}
        top={-space[3]}
        fontSize={2}
        direction="column"
        zIndex="hoverOverlay"
      >
        <FlexContainer>
          <Container paddingTop={1}>
            <IoMdArrowDropleft />
          </Container>
          {TEXT.chartAxisNumber[language]}
          <Container paddingTop={1}>
            <IoMdArrowDropright />
          </Container>
        </FlexContainer>
        <FlexContainer direction="column">
          {TEXT.tooltipAge[language]}
          <IoMdArrowDropdown />
        </FlexContainer>
      </FlexContainer> */}
      <ChartSvg absPos areaRef={svgRef} width={dims.width} height={dims.height}>
        <ChartArea
          areaRef={areaRef}
          marginLeft={margin.left}
          marginTop={margin.top}
        >
          <AxisLine
            y1={dims.chartHeight}
            y2={dims.chartHeight}
            x1={0}
            x2={dims.chartWidth}
            stroke={0.5}
          />
          <AxisLine y1={0} y2={dims.chartHeight} x1={0} x2={0} stroke={0.5} />
        </ChartArea>
      </ChartSvg>
    </ChartWrapper>
  )
}

AreaChart.defaultProps = {
  margin: { top: 5, right: 10, bottom: 25, left: 25 },
}
