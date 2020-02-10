import styled, { css } from "styled-components"
import {
  themifyFontSize,
  themifyFontWeight,
  themifyColor,
  themifySpace,
} from "../../../themes/mixins"

const Title = styled.span`

  ${({
    gridArea,
    marginBottom,
    marginRight,
    fontSize,
    paddingBottom,
    marginTop,
    display
  }) => css`
    display: ${display || "inline-block"};
    grid-area: ${gridArea};
    margin-bottom: ${themifySpace(marginBottom)}px;
    margin-top: ${themifySpace(marginTop)}px;
    margin-right: ${themifySpace(marginRight)}px;
    font-size: ${themifyFontSize(fontSize)};
    padding-bottom: ${themifyFontSize(paddingBottom)}px;
  `}
  font-weight: ${({ fontWeight }) => themifyFontWeight(fontWeight)};
  color: ${({ color }) => themifyColor(color)};
  line-height: ${({ lineHeight }) => lineHeight};

  a {
    text-decoration: none;
    color: ${({ color }) => themifyColor(color)};
    font-weight: ${({ anchorFontWeight }) =>
      themifyFontWeight(anchorFontWeight)};
  }
`

export default Title

Title.defaultProps = {
  color: "grayDarkest",
  lineHeight: 1.2,
  anchorFontWeight: 5,
}
