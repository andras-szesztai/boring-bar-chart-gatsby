import React from "react"
import { GridContainer, FlexContainer } from "../atoms/containers"

export default function({ direction, elements = [], position }) {
  return (
    <GridContainer
      rows={direction === "column" && `repeat(${elements.length}, 1fr)`}
      columns={direction === "row" && `repeat(${elements.length}, 1fr)`}
      absPos
      {...position}
    >
      {elements.map(({ justify, component }) => {
        const Comp = component
        console.log(Comp)
        return (
          <FlexContainer
            justify={justify}
          >
            {Comp}
          </FlexContainer>
        )
      })}
    </GridContainer>
  )
}
