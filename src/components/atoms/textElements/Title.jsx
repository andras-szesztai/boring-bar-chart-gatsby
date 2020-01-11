import styled from "styled-components"
import {
  themifyFontSize,
  themifyFontWeight,
  themifyColor,
} from "../../../themes/mixins"

const Title = styled.span`
  font-size: ${({ fontSize }) => themifyFontSize(fontSize)};
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
  color: "grayDarker",
  lineHeight: 1.2,
  anchorFontWeight:5
}
