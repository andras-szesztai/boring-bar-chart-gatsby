import React from "react"
import { GridContainer } from "../../atoms"

export default function TooltipContainer({
  top, left
}) {
  return (
    <GridContainer
      pos="fixed"
      width="100px"
      height="100px"
      withBorder
      top={top}
      left={left}
    >
      Tooltip
    </GridContainer>
  )
}
