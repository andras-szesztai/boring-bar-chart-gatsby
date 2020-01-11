import styled, { css } from "styled-components"
import {
  themifyFontSize,
  themifyFontWeight,
  themifyColor,
  themifyZIndex,
  themifySpace,
} from "../../../themes/mixins"

const Container = styled.div`
  user-select: none;
  
  font-size: ${({ fontSize }) => themifyFontSize(fontSize)};
  font-weight: ${({ fontWeight }) => themifyFontWeight(fontWeight)};
  color: ${({ fontColor }) => themifyColor(fontColor)};
  background: ${({ bgColor }) => bgColor};
  z-index: ${({ zIndex }) => themifyZIndex(zIndex)};
  padding-bottom: ${({paddingBottom}) => themifySpace(paddingBottom)}px;


  ${({ absPos, bottom, right, top, left }) => absPos && css`
    position: absolute;
    bottom: ${bottom}px;
    right: ${right}px;
    left: ${left}px;
    top: ${top}px;
  `}

  ${({ fullScreen }) =>
    fullScreen &&
    css`
      height: 100vh;
      width: 100vw;
    `}

  ${({ fullSize }) =>
    fullSize &&
    css`
      height: 100%;
      width: 100%;
    `}

  ${({ height, width }) =>
    css`
      height: ${height}px;
      width: ${width}px;
      white-space: nowrap;
    `}

  ${({gridArea}) => css`
    grid-area: ${gridArea};
  `}
  
`

export default Container

Container.defaultProps = {
  fontColor: "grayDarker",
  fontSize: 1
}
