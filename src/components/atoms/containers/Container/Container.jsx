import styled, { css } from "styled-components"
import {
  themifyFontSize,
  themifyFontWeight,
  themifyColor,
  themifyZIndex,
  themifySpace,
  themifyTransition,
  themifyEase,
} from "../../../themes/mixins"

const Container = styled.div`
  user-select: none;
  transition: opacity ${themifyTransition("sm")} ${themifyEase(
  "easeInOutCubic"
)};

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
    marginLeft,
    marginRight,
    paddingTop,
  }) => css`
    grid-area: ${gridArea};
    text-align: ${textAlign};
    cursor: ${cursor};
    position: ${pos};
    padding: ${padding};
    font-size: ${themifyFontSize(fontSize)};
    font-weight: ${themifyFontWeight(fontWeight)};
    color: ${themifyColor(fontColor)};
    background: ${bgColor};
    z-index: ${themifyZIndex(zIndex)};
    padding-bottom: ${themifySpace(paddingBottom)}px;
    padding-top: ${themifySpace(paddingTop)}px;
    padding-right: ${themifySpace(paddingRight)}px;
    padding-left: ${themifySpace(paddingLeft)}px;
    border-radius: ${themifySpace(borderRadius)}px;
    margin-bottom: ${themifySpace(marginBottom)}px;
    margin-left: ${themifySpace(marginLeft)}px;
    margin-right: ${themifySpace(marginRight)}px;
  `}

  ${({ absPos, pos, bottom, right, top, left }) =>
    (absPos || pos === "fixed") &&
    css`
      position: absolute;
      bottom: ${bottom}px;
      right: ${right}px;
      left: ${left}px;
      top: ${top}px;
    `}

    ${({ visibility }) =>
      visibility &&
      css`
        transition: opacity 300ms;
        opacity: ${visibility === "visible" ? 1 : 0};
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
      max-height: ${maxHeight || height};
      min-height: ${minHeight || height};

      width: ${width};
      max-width: ${maxWidth || width};
      min-width: ${minWidth || width};

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

  ${({ isHideable, isVisible }) =>
    isHideable &&
    (isVisible
      ? css`
          opacity: 1;
          pointer-events: auto;
        `
      : css`
          opacity: 0;
          pointer-events: none;
        `)}
  
  
`

export default Container

Container.defaultProps = {
  fontColor: "grayDarkest",
  fontSize: 1,
}
