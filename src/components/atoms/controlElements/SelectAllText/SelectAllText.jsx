import React from "react"
import styled from "styled-components"
import { IoIosArrowDroprightCircle } from "react-icons/io"

import { FlexContainer } from "../../containers"
import { ColoredSpan } from "../../textElements"
import { colors } from "../../../../themes/theme"
const { grayDarkest } = colors

const Container = styled(FlexContainer)``

const Span = styled(ColoredSpan)`
  ${Container}:hover & {
    text-decoration: underline;
  }
`

export default function({ array, handleClick }) {
  const isMissing = array.includes(false)
  return (
    <Container
      fontSize={1}
      cursor="pointer"
      onClick={() => handleClick(isMissing)}
    >
      <Span isHoverable paddingBottom={0}>
        {isMissing ? "Select all" : "Unselect all"}
      </Span>
      <FlexContainer height="100%" marginLeft={1}>
        <IoIosArrowDroprightCircle size={15} fill={grayDarkest} />
      </FlexContainer>
    </Container>
  )
}
