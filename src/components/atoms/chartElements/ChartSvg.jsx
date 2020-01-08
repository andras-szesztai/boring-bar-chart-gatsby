import styled, { css } from "styled-components"
import {
  themifyFontSize,
  themifyFontWeight,
  themifyColor,
} from "../../../themes/mixins"

export const ChartSvg = styled.svg`
  width: ${props => props.width || 0}px;
  height: ${props => props.height || 0}px;

  font-size: ${({ fontSize }) => themifyFontSize(fontSize)};
  font-weight: ${({ fontWeight }) => themifyFontWeight(fontWeight)};

  text {
    fill: ${({ fontColor }) => fontColor && themifyColor(fontColor)};
  }

  ${({ absPos, top, left }) =>
    absPos &&
    css`
      position: absolute;
      top: ${top}px;
      left: ${left || 0}px;
    `}
`

export default ChartSvg

