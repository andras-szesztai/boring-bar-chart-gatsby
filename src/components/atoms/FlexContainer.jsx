import React from "react"
import styled from "styled-components"
import { themifyFontSize, themifyFontWeight, themifyColor } from "../../themes/mixins"

const Container = styled.div`
  font-size: ${({ fontSize }) => themifyFontSize(fontSize)};
  font-weight: ${({ fontWeight }) => themifyFontWeight(fontWeight)};
  color: ${({ fontColor }) => themifyColor(fontColor)};

  user-select: none;
`

export default function FlexContainer(props) {
  return <Container {...props}>{props.children}</Container>
}

FlexContainer.defaultProps = {
  fontColor: "grayDarker"
}
