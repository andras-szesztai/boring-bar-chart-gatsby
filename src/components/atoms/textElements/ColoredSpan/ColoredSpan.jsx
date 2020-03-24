import styled, { css } from "styled-components"
import {
  themifyFontSize,
  themifyFontWeight,
  themifyColor,
  themifyZIndex,
  themifySpace,
} from "../../../../themes/mixins"

const ColoredSpan = styled.span`
  ${({
    fontSize,
    fontWeight,
    color,
    zIndex,
    paddingBottom,
    bgColor,
    paddingLeft,
    paddingRight,
  }) => css`
    font-size: ${themifyFontSize(fontSize)};
    font-weight: ${themifyFontWeight(fontWeight)};
    color: ${themifyColor(color)};
    background-color: ${themifyColor(bgColor)};
    z-index: ${themifyZIndex(zIndex)};
    padding-bottom: ${themifySpace(paddingBottom)}px;
    padding-left: ${themifySpace(paddingLeft)}px;
    padding-right: ${themifySpace(paddingRight)}px;
  `}

  ${({ isHoverable }) =>
    isHoverable &&
    css`
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
