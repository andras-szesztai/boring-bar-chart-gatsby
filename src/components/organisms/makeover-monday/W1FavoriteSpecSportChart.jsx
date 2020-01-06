import React from 'react';
import styled from 'styled-components'

const ChartContainer = styled.div`
  width: 80vw;
  min-width: 600px;
  max-width: 1100px;

  height: 80vh;
  max-height: 600px;
  min-height: 500px;

  border: 1px solid black;

  display: grid;
  grid-template-rows: repeat(10, 1fr);
  grid-row-gap: 1rem;
  
`

export default function({
  data,
  valueArray
}){


  return (
    <ChartContainer>
      Chart
    </ChartContainer>
  )
}