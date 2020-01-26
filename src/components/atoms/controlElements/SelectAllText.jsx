import React from "react"
import { IoIosArrowDroprightCircle } from "react-icons/io"

import { FlexContainer } from "../containers"
import { ColoredSpan } from "../textElements"
import { colors } from "../../../themes/theme"
const { grayDarkest } = colors

export default function({ array, handleClick }) {
  const isMissing = array.includes(false)
  return (
    <FlexContainer
      // fontWeight={3}
      fontSize={1}
      cursor="pointer"
      onClick={() => handleClick(isMissing)}
    >
      <ColoredSpan isHoverable paddingBottom={0}>
        {isMissing ? "Select all" : "Unselect all"}
      </ColoredSpan>
      <FlexContainer height="100%" marginLeft={2}>
        <IoIosArrowDroprightCircle size={15} fill={grayDarkest} />
      </FlexContainer>
    </FlexContainer>
  )
}
