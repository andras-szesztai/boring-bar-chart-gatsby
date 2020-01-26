import styled, { css } from "styled-components"
import {
  themifyFontSize,
  themifyFontWeight,
  themifyColor,
  themifySpace,
} from "../../../themes/mixins"

const Title = styled.span`

  ${({ gridArea, marginBottom, fontSize }) =>  css`
    grid-area: ${gridArea};
    margin-bottom: ${themifySpace(marginBottom)}px;
    font-size: ${themifyFontSize(fontSize)};
  `}
  font-weight: ${({ fontWeight }) => themifyFontWeight(fontWeight)};
  color: ${({ color }) => themifyColor(color)};
  line-height: ${({ lineHeight }) => lineHeight};

  a {
    text-decoration: none;
    color: ${({ color }) => themifyColor(color)};
    font-weight: ${({ anchorFontWeight }) => themifyFontWeight(anchorFontWeight)};
  }
`

export default Title

Title.defaultProps = {
  color: "grayDarkest",
  lineHeight: 1.2,
  anchorFontWeight:5
}
