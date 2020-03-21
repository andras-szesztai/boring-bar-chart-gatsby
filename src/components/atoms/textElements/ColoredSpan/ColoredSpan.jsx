import styled, { css } from "styled-components"
import {
  themifyFontSize,
  themifyFontWeight,
  themifyColor,
  themifyZIndex,
  themifySpace,
} from "../../../themes/mixins"

const ColoredSpan = styled.span`
  ${({ fontSize, fontWeight, color, zIndex, paddingBottom }) => css`
    font-size: ${themifyFontSize(fontSize)};
    font-weight: ${themifyFontWeight(fontWeight)};
    color: ${themifyColor(color)};
    z-index: ${themifyZIndex(zIndex)};
    padding-bottom: ${themifySpace(paddingBottom)}px;
  `}

  ${({ isHoverable }) => isHoverable && css`
    &:hover {
      text-decoration: underline;
    }
  `}
`

ColoredSpan.defaultProps = {
  color: "grayDarkest",
  fontSize: 1,
}

export default ColoredSpan
