import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { scaleLinear } from "d3-scale"
import { axisBottom } from "d3-axis"
import { select } from "d3-selection"
import { max, min } from "d3-array"

import { VerticalDropChartRow } from "../../organisms"
import { getAxisPadding } from "../../../utils"
import { FlexContainer, ChartSvg } from "../../atoms"
import { themifyFontSize } from "../../../themes/mixins"
import { useDimensions } from "../../../hooks"

const ChartContainer = styled.div`
  position: relative;

  width: 80vw;
  min-width: 600px;
  max-width: 1100px;

  height: 80vh;
  max-height: 600px;
  min-height: 500px;

  display: grid;
  grid-template-rows: repeat(10, 1fr);
  grid-row-gap: 1rem;

  text {
    font-size: ${themifyFontSize(1)};
  }
`

const TitleContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;

  display: grid;
`

const axisSvgHeight = 12

// Inspired: https://www.behance.net/gallery/90323631/Life-expectancy-BBC-Science-Focus
const chartColors = {
  text: "#191919",
  bg: "#E5E5E5",
  neu: "#999999",
  lgGrowth: "#195a98",
  lgDecline: "#d65e57",
}

const margin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 10,
}

export default function({ rawData, data, valueArray }) {
  const [domain, setDomain] = useState(undefined)
  useEffect(() => {
    if (rawData && !domain) {
      const params = [rawData, "perc", 0.025]
      setDomain([
        min(rawData, d => d.perc) - getAxisPadding(...params),
        max(rawData, d => d.perc) + getAxisPadding(...params),
      ])
    }
  }, [domain, rawData])

  const svgRef = useRef()
  const wrapperRef = useRef()
  const { width, height } = useDimensions(wrapperRef)
  const [axisInit, setAxisInit] = useState(false)
  function addAxis() {
    const axis = axisBottom(
      scaleLinear()
        .domain(domain)
        .range([0, svgRef.current.clientWidth - margin.left])
    )
      .tickSize(0)
      .tickFormat(d => d + "%")
    select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(axis)
    select(svgRef.current)
      .select(".domain")
      .remove()
    setAxisInit(true)
  }
  useEffect(() => {
    if (svgRef && svgRef.current && width && !axisInit) {
      addAxis()
    }
  })

  return (
    <FlexContainer fullScreen bgColor={chartColors.bg} fontColor="grayDarkest">
      <ChartContainer ref={wrapperRef}>
        {valueArray &&
          valueArray.map(val => (
            <VerticalDropChartRow
              colors={chartColors}
              axisLabel={val}
              key={val}
              data={data[val]}
              domain={domain}
              margin={margin}
            />
          ))}
        <ChartSvg
          absPos
          top={height / 2 - axisSvgHeight / 2}
          left={margin.left}
          ref={svgRef}
          width={width}
          height={axisSvgHeight}
          fontSize={1}
          fontColor="grayLight"
        />
        <FlexContainer
          fixSize
          height={100}
          fontSize={5}
          align="flex-end"
          direction="column"
          paddingBottom={2}
          absPos
          bottom={height / 2 + axisSvgHeight / 2}
          right={0}
        >
          <span>
            Top Spectator Sports in the United States
          </span>
          <span>
            Changes between 2008 and 2017
          </span>
        </FlexContainer>
      </ChartContainer>
    </FlexContainer>
  )
}
