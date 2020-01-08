import React from "react"
import styled from "styled-components"

import { VerticalAxisLabelContainer } from "../../atoms"
import { VerticalDropChart } from '../../molecules'


const RowContainer = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-column-gap: 1rem;
  align-items: center;
`

export default function({ axisLabel, data, xAxis, domain, colors }) {

  return (
    <RowContainer>
      <VerticalAxisLabelContainer label={axisLabel} color={colors.text}/>
      {domain && <VerticalDropChart data={data} xAxis={xAxis} domain={domain} colors={colors}/>}
    </RowContainer>
  )
}
