import React from "react"
import styled, { css } from "styled-components"
import chroma from "chroma-js"

import { colors } from "../../../../themes/theme"

const RibbonContainer = styled.div`
  ${({ width, top }) => css`
    width: ${width}px;
    height: ${width}px;
    top: -${top}px;
  `}
  overflow: hidden;
  position: absolute;
  z-index: 1;
  pointer-events: none;
  right: -13px;

  span {
    position: absolute;
    display: block;
    width: 200px;
    padding: ${({ padding }) => padding}px 0;
    background-color: ${chroma(colors.tealBlueLighter).alpha(.95)};
    color: ${colors.tealBlueDarkest};
    text-align: center;
    font-weight: 600;
    letter-spacing: .95px;
    left: -43px;
    top: 28px;
    transform: rotate(45deg);
  }
`

export default function Ribbon({ text, width, padding, top }) {
  return (
    <RibbonContainer width={width} padding={padding} top={top}>
      <span>{text}</span>
    </RibbonContainer>
  )
}

Ribbon.defaultProps = {
  width: 100,
  padding: 5,
  top: 10
}
