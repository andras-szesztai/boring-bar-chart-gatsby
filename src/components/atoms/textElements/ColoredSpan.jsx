import styled from "styled-components"
import { themifyFontSize, themifyFontWeight, themifyColor, themifyZIndex, themifySpace } from "../../../themes/mixins"

const ColoredSpan = styled.span`
  font-size: ${({ fontSize }) => themifyFontSize(fontSize)};
  font-weight: ${({ fontWeight }) => themifyFontWeight(fontWeight)};
  color: ${({ color }) => themifyColor(color)};
  z-index: ${({ zIndex }) => themifyZIndex(zIndex)};
  padding-bottom: ${({paddingBottom}) => themifySpace(paddingBottom)}px;
`

ColoredSpan.defaultProps = {
  color: "grayDarker",
  fontSize: 1
}

export default ColoredSpan