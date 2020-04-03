import React from "react"
import styled from "styled-components"
import { colors } from "../../../../themes/theme"

const RibbonContainer = styled.div`
  width: 100px;
  height: 100px;
  overflow: hidden;
  position: absolute;
  z-index: 1;
  pointer-events: none;
  top: -10px;
  right: -10px;

  ::before,
  ::after {
    position: absolute;
    z-index: -1;
    content: "";
    display: block;
    border: 5px solid ${colors.tealBlueLighter};
    border-top-color: transparent;
    border-right-color: transparent;
  }

  ::before {
    top: 0;
    left: 0;
  }

  ::after {
    bottom: 0;
    right: 0;
  }

  span {
    position: absolute;
    display: block;
    width: 160px;
    padding: 5px 0;
    background-color: ${colors.tealBlueLighter};
    color: ${colors.tealBlueDarkest};
    text-align: center;
    font-weight: 600;
    letter-spacing: 1.5px;
    left: -25px;
    top: 30px;
    transform: rotate(45deg);
  }
`

export default function Ribbon({ text }) {
  return (
    <RibbonContainer>
      <span>{text}</span>
    </RibbonContainer>
  )
}
