import React from "react"
import styled from "styled-components"
import { useTransition, animated } from "react-spring"

import { PortfolioItem } from "../../molecules"

const ItemContainer = styled(animated.div)`
  overflow: hidden;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;

  height: 25rem;

  will-change: transform, opacity;
`

function DataVisualizationGrid({ list }) {
  const indexedList = list.map((node, i) => ({ ...node, index: i }))
  const transitions = useTransition(indexedList, item => item.node.title, {
    trail: 1000 / list.length,
    from: { opacity: 0, transform: "scale(0)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0)" },
  })

  return transitions.map(({ item, key, props }) => (
    <ItemContainer key={key} style={props}>
      <PortfolioItem data={item.node} />
    </ItemContainer>
  ))
}

export default DataVisualizationGrid
