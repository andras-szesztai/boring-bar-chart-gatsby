import React from "react"
import styled from "styled-components"
import { VerticalAxisLabelContainer } from "../../atoms"
import { VerticalDropChart } from '../../molecules'

const RowContainer = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-column-gap: 1rem;
  align-items: center;

  border: 1px solid black;
`

export default function({ axisLabel, data }) {
  return (
    <RowContainer>
      <VerticalAxisLabelContainer label={axisLabel}/>
      <VerticalDropChart data={data}/>
    </RowContainer>
  )
}
