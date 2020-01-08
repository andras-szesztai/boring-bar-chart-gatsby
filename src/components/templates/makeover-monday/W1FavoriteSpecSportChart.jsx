import React, { useEffect, useState } from "react"
import styled from "styled-components"

import { VerticalDropChartRow } from "../../organisms"
import { getAxisPadding } from "../../../utils"
import { max, min } from "d3-array"
import { FlexContainer } from "../../atoms"

const ChartContainer = styled.div`
  width: 80vw;
  min-width: 600px;
  max-width: 1100px;

  height: 80vh;
  max-height: 600px;
  min-height: 500px;

  display: grid;
  grid-template-rows: repeat(10, 1fr);
  grid-row-gap: 1rem;
`


// Inspired: https://www.behance.net/gallery/90323631/Life-expectancy-BBC-Science-Focus
const chartColors = {
  bg: "#04091d",
  text: "#fff",
  lgGrowth: "#195a98",
  smGrowth: "#a1d5cb",
  smDecline: "#ffd7d8",
  lgDecline: "#d65e57",
  
}

export default function({ rawData, data, valueArray }) {
  const [domain, setDomain] = useState(undefined)
  useEffect(() => {
    if (rawData && !domain) {
      const params = [rawData, "perc", 0.025]
      setDomain([
        max(rawData, d => d.perc) + getAxisPadding(...params),
        min(rawData, d => d.perc) - getAxisPadding(...params),
      ])
    }
  }, [domain, rawData])

  return (
    <FlexContainer fullScreen bgColor={chartColors.bg} fontColor="grayDarkest">
      <ChartContainer>
        {valueArray &&
          valueArray.map(val => (
            <VerticalDropChartRow
              colors={chartColors}
              axisLabel={val}
              key={val}
              data={data[val]}
              domain={domain}
            />
          ))}
      </ChartContainer>
    </FlexContainer>
  )
}
