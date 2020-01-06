import React from "react"
import styled, { css } from "styled-components"
import { themifyFontSize, themifyFontWeight, themifyColor } from "../../../themes/mixins"

const Container = styled.div`
  font-size: ${({ fontSize }) => themifyFontSize(fontSize)};
  font-weight: ${({ fontWeight }) => themifyFontWeight(fontWeight)};
  color: ${({ fontColor }) => themifyColor(fontColor)};

  ${({ fullScreen }) => fullScreen && css`
    height: 100vh;
    width: 100vw;
  `}

  ${({ fullSize }) => fullSize && css`
    height: 100%;
    width: 100%;
  `}

  display: flex;
  justify-content: ${({ justify }) =>  justify};
  align-items: ${({ align }) =>  align};

  user-select: none;
`

export default function FlexContainer(props) {
  return <Container {...props}>{props.children}</Container>
}

FlexContainer.defaultProps = {
  fontColor: "grayDarker",
  justify: "center",
  align: "center"
}
