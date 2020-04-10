import styled, { css } from "styled-components"
import {
  themifyFontSize,
  themifyFontWeight,
  themifyColor,
  themifyZIndex,
  themifySpace,
  themifyTransition,
  themifyEase,
} from "../../../../themes/mixins"
import { transition, dropShadow } from "../../../../themes/theme"

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
    opacity,
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
    marginTop,
    paddingTop,
    lineHeight,
  }) => css`
    grid-area: ${gridArea};
    text-align: ${textAlign};
    cursor: ${cursor};
    position: ${pos};
    line-height: ${lineHeight};
    opacity: ${opacity};
    padding: ${themifySpace[padding] || 0}px;
    font-size: ${themifyFontSize(fontSize)};
    font-weight: ${themifyFontWeight(fontWeight)};
    color: ${themifyColor(fontColor) || "inherit"};
    background: ${themifyColor(bgColor || "transparent")};
    z-index: ${themifyZIndex(zIndex)};
    padding-bottom: ${themifySpace(paddingBottom) || 0}px;
    padding-top: ${themifySpace(paddingTop) || 0}px;
    padding-right: ${themifySpace(paddingRight) || 0}px;
    padding-left: ${themifySpace(paddingLeft) || 0}px;
    border-radius: ${themifySpace(borderRadius) || 0}px;
    margin-bottom: ${themifySpace(marginBottom) || 0}px;
    margin-left: ${themifySpace(marginLeft) || 0}px;
    margin-right: ${themifySpace(marginRight) || 0}px;
    margin-top: ${themifySpace(marginTop) || 0}px;
  `}


  ${({ hoverable }) =>
    hoverable &&
    css`
      transition: all ${transition.sm};
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

    ${({ fixedPos }) =>
      fixedPos &&
      css`
        position: fixed;
        width: ${fixedPos.width};
        margin-left: ${fixedPos.marginLeft};
        bottom: ${fixedPos.bottom};
        right: ${fixedPos.right};
        left: ${fixedPos.left};
        top: ${fixedPos.top};
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

  ${({ withDropShadow }) =>
    withDropShadow &&
    css`
      filter: drop-shadow(${dropShadow.primary})
        drop-shadow(${dropShadow.secondary});
    `}

  ${({ borderColor }) =>
    borderColor &&
    css`
      border: 1px solid ${themifyColor(borderColor)};
    `}

  ${({ withBorder }) =>
    withBorder &&
    css`
      border: 1px solid gray;
    `}

  ${({ withBorderBottom }) =>
    withBorderBottom &&
    css`
      border-bottom: ${withBorderBottom.thickness}px
        ${withBorderBottom.style || "solid"} ${withBorderBottom.color};
    `}
  
  ${({ noPointerEvents }) =>
    noPointerEvents &&
    css`
      pointer-events: none;
    `}

    ${({ noWrap }) =>
      noWrap &&
      css`
        white-space: nowrap;
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
