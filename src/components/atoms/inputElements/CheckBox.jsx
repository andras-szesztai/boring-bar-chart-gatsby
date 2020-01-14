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
  const { value, handleClick } = props
  const [check, setCheck] = useState(false)
  return (
    <CheckBox
      checked={check}
      onClick={() => {
        setCheck(prev => !prev);
        handleClick && handleClick(value)
      }}
      {...props}
    />
  )
}

CheckBox.defaultProps = {
  width: 15
}

// .fancy.square label {
//   input[type=checkbox]:after {
//     content: '\f0c8'; // square
//   }
//   input[type=checkbox]:checked::after {
//     content: '\f14a'; // check-square
//   }
// }

//https://codepen.io/andras-newzoo/pen/BayPRRp
