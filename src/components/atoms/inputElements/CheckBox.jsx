import React, { useState } from "react"
import styled, { css } from "styled-components"
import chroma from "chroma-js"

import {
  themifyColor,
  themifyTransition,
  themifyEase,
} from "../../../themes/mixins"

const CheckBox = styled.div`
  scale: 1;

  ${({ cursor, width, color, isRadio, checked, transitionDuration }) => css`
    cursor: ${cursor || "pointer"};
    width: ${width}px;
    height: ${width}px;
    border: 1px solid ${themifyColor(color)};
    border-radius: ${isRadio ? width : width * 0.15}px;
    background: ${checked ? themifyColor(color) : "transparent"};
    transition: background ${themifyTransition(transitionDuration)}
      ${themifyEase("easeInOutCubic")};

    :hover {
      background: ${!checked && chroma(themifyColor(color)).brighten(3)};
    }
  `} /* &:active {
    transform: scale(0.6);
  } */
`

export default function(props) {
  const { value, handleClick, initialCheck, checked, parentChecked } = props
  const [check, setCheck] = useState(initialCheck)
  return (
    <CheckBox
      checked={parentChecked ? checked : check}
      onClick={() => {
        !parentChecked && setCheck(prev => !prev)
        handleClick && handleClick(value)
      }}
      {...props}
    />
  )
}

CheckBox.defaultProps = {
  width: 15,
  transitionDuration: "sm",
  color: "grayDarkest",
}
