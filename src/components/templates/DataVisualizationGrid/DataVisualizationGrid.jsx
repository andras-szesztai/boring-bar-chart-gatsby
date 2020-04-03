import React from "react"
import styled from "styled-components"

import { GridContainer } from "../../atoms"
import { PortfolioItem } from "../../molecules"

const MainGrid = styled(GridContainer)`
  padding: 4rem;
  overflow-y: auto;
  grid-row-gap: 1rem;

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, 2fr);
    padding: 6rem;
    grid-column-gap: 4rem;
    grid-row-gap: 2rem;
  }
  @media (min-width: 1300px) {
    padding: 8rem;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 6rem;
    grid-row-gap: 3rem;
  }
`

function DataVisualizationGrid({ list }) {
  return (
    <MainGrid>
      {list.map(({ node }) => (
        <PortfolioItem data={node} />
      ))}
    </MainGrid>
  )
}

export default DataVisualizationGrid
