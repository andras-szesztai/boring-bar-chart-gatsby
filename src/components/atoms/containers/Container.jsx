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

  ${({
    gridArea,
    textAlign,
    cursor,
    pos,
    padding,
    fontSize,
    fontWeight,
    fontColor,
    bgColor,
    zIndex,
    paddingBottom,
    paddingRight,
    paddingLeft,
    borderRadius,
    marginBottom,
    marginLeft
  }) => css`
    grid-area: ${gridArea};
    text-align: ${textAlign};
    cursor: ${cursor};
    position: ${pos};
    padding: ${padding};
    font-size: ${themifyFontSize(fontSize || 1)};
    font-weight: ${themifyFontWeight(fontWeight)};
    color: ${themifyColor(fontColor)};
    background: ${bgColor};
    z-index: ${themifyZIndex(zIndex)};
    padding-bottom: ${themifySpace(paddingBottom)}px;
    padding-right: ${themifySpace(paddingRight)}px;
    padding-left: ${themifySpace(paddingLeft)}px;
    border-radius:  ${themifySpace(borderRadius)}px;
    margin-bottom: ${themifySpace(marginBottom)}px;
    margin-left: ${themifySpace(marginLeft)}px;
  `}

  ${({ absPos, bottom, right, top, left }) =>
    absPos &&
    css`
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

  ${({ height, width, whiteSpace, maxHeight, minHeight, maxWidth, minWidth }) =>
    css`
      height: ${height};
      max-height: ${maxHeight};
      min-height: ${minHeight};

      width: ${width};
      max-width: ${maxWidth};
      min-width: ${minWidth};

      white-space: ${whiteSpace};
    `}

  ${({ borderColor }) =>
    borderColor &&
    css`
      border: 1px solid ${borderColor};
    `}

  ${({ withBorder }) =>
    withBorder &&
    css`
      border: 1px solid gray;
    `}
  
  
`

export default Container

Container.defaultProps = {
  fontColor: "grayDarkest",
}
