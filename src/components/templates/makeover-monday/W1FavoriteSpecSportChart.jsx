import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { scaleLinear } from "d3-scale"
import { axisBottom } from "d3-axis"
import { select } from "d3-selection"
import { max, min } from "d3-array"

import { VerticalDropChartRow } from "../../organisms"
import { getAxisPadding } from "../../../utils"
import { FlexContainer, ChartSvg, Title, NeumorphButton } from "../../atoms"
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

  const [buttons, setButtons] = useState({
    "2008": { text: 2008, checked: false },
    "2018": { text: 2018, checked: false },
  })

  console.log(buttons)

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
          justify="flex-end"
          align="flex-end"
          direction="column"
          paddingBottom={1}
          absPos
          bottom={height / 2 + axisSvgHeight / 2}
          right={0}
        >
          <Title fontSize={2} fontColor="grayLight">
            Changes between 2008 and 2017
          </Title>
          <Title fontSize={5} fontWeight={0} fontColor="grayDarkest">
            Top Spectator Sports in the United States
          </Title>
        </FlexContainer>
        <FlexContainer
          fixSize
          height={55}
          width={200}
          justify="space-around"
          absPos
          top={height / 2 + axisSvgHeight / 2}
          right={0}
        >
          {Object.values(buttons).map(b => (
            <NeumorphButton
              height={30}
              width={60}
              {...b}
              handleClick={() =>
                setButtons(prev => ({
                  ...prev,
                  [b.text]: {
                    ...prev[b.text],
                    checked: !prev[b.text].checked,
                  },
                }))
              }
            />
          ))}
        </FlexContainer>
      </ChartContainer>
    </FlexContainer>
  )
}
