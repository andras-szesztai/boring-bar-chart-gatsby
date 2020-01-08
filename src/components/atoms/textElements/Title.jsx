import styled from "styled-components"
import {
  themifyFontSize,
  themifyFontWeight,
  themifyColor,
} from "../../../themes/mixins"

const Title = styled.span`
  font-size: ${({ fontSize }) => themifyFontSize(fontSize)};
  font-weight: ${({ fontWeight }) => themifyFontWeight(fontWeight)};
  color: ${({ fontColor }) => themifyColor(fontColor)};
  line-height: ${({ lineHeight }) => lineHeight};
`

export default Title

Title.defaultProps = {
  fontColor: "grayDarker",
  lineHeight: 1.2,
}
