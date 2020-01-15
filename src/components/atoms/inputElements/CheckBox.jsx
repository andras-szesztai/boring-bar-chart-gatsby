import React, { useState } from "react"
import styled, { css } from "styled-components"
import {
  themifyColor,
  themifyTransition,
  themifyEase,
} from "../../../themes/mixins"

const CheckBox = styled.div`
  cursor: pointer;
  scale: 1;

  ${({ width, color, isRadio, checked }) => css`
    width: ${width}px;
    height: ${width}px;
    border: 1px solid ${color || themifyColor("grayDarkest")};
    border-radius: ${isRadio ? width : width * 0.15}px;
    background: ${checked
      ? color || themifyColor("grayDarkest")
      : "transparent"};
    transition: all ${themifyTransition("sm")}
      ${themifyEase("easeInOutCubic")};
  `}

  &:active {
    transform: scale(0.6);
  }
`

export default function(props) {
  const { value, handleClick, initialCheck, checked, parentChecked } = props
  const [check, setCheck] = useState(initialCheck)
  return (
    <CheckBox
      checked={parentChecked ? checked : check}
      onClick={() => {
        !parentChecked && setCheck(prev => !prev);
        handleClick && handleClick(value)
      }}
      {...props}
    />
  )
}

CheckBox.defaultProps = {
  width: 15
}