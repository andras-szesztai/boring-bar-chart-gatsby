import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { VerticalDropChartRow } from "../../organisms"
import { scaleLinear } from "d3-scale"
import { max, min } from "d3-array"
import { getAxisPadding } from "../../../utils"

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

export default function({ rawData, data, valueArray }) {

  const [ xAxis, setXAxis ] = useState(undefined)
  useEffect(() => {
    if(rawData && !xAxis){
      const params = [rawData, 'perc', .025]
      setXAxis(scaleLinear().domain())
      .domain([
        max(rawData, d => d.perc) + getAxisPadding(...params),
        min(rawData, d => d.perc) - getAxisPadding(...params)
      ]);
    }
  }, [rawData, xAxis])

  return (
    <ChartContainer>
      {xAxis && valueArray.map(val => (
        <VerticalDropChartRow axisLabel={val} key={val} data={data[val]} xAxis={xAxis}/>
      ))}
    </ChartContainer>
  )
}
