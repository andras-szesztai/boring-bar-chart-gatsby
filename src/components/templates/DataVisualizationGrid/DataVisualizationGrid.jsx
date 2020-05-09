import React, { useRef } from "react"
import styled from "styled-components"
import numToWords from "num-to-words"
import { useTransition, animated } from "react-spring"

import { GridContainer } from "../../atoms"
import { PortfolioItem } from "../../molecules"

const MainGrid = styled(GridContainer)`
  padding: 4rem;
  overflow-y: auto;
  grid-row-gap: 1rem;

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, 2fr);
    padding: 6rem;
    grid-column-gap: 0rem;
    grid-row-gap: 0rem;
    grid-template-rows: repeat(5, 10rem);
    grid-template-areas:
      "zero two"
      "2 3"
      "4 5"
      "6 7"
      "8 9"
      "10 11"
      "12 13"
      "14 15"
      "16 17";
  }
  @media (min-width: 1300px) {
    padding: 8rem;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 6rem;
    grid-row-gap: 3rem;
    grid-template-rows: repeat(5, 10rem);
    grid-template-areas:
      "zero one two"
      "three four five"
      "six seven eight"
      "nine ten eleven"
      "twelve thirteen fourteen";
  }
`

const TestDiv = styled(animated.div)`
  overflow: hidden;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
  grid-area: ${({ gridArea }) => gridArea};
`

function DataVisualizationGrid({ list }) {
  const indexedList= list.map((node, i)  => ({ ...node, index: i }))
  const transitions = useTransition(
    indexedList,
    item => item.node.title,
    {
      trail: 800 / list.length,
      from: { opacity: 0, transform: "scale(0)" },
      enter: { opacity: 1, transform: "scale(1)" },
      leave: { opacity: 0, transform: "scale(0)" },
    }
  )
  return (
    <MainGrid>
      {transitions.map(({ item, key, props }) => (
        <TestDiv key={key} style={props} gridArea={numToWords(item.index)} />
      ))}
    </MainGrid>
  )
}

export default DataVisualizationGrid
