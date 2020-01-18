import React from "react"
import { FlexContainer } from "../containers"
import { ColoredSpan } from "../textElements"

export default function({
  array, handleClick
}){

  const isMissing = array.includes(false)
  return (
    <FlexContainer
      // fontWeight={3}
      fontSize={1}
      cursor="pointer"
      onClick={() => handleClick(isMissing)}
    >
      <ColoredSpan isHoverable paddingBottom={2}>
        {isMissing ? "Select all" : "Unselect all"}
      </ColoredSpan>
    </FlexContainer>
  )
}

