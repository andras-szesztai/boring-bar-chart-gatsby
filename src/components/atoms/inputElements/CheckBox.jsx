import React, { useState } from "react"
import styled, { css } from "styled-components"
import { themifyColor } from "../../../themes/mixins"

const CheckBox = styled.div`
  cursor: pointer;

  ${({ width, color, isRadio, checked }) => css`
    width: ${width}px;
    height: ${width}px;
    border: 1px solid ${color || themifyColor("grayDarker")};
    border-radius: ${isRadio ? width : width * 0.15}px;
    background: ${checked
      ? color || themifyColor("grayDarker")
      : "transparent"};
    transition: .3s
  `}
`

export default function(props) {
  const { value } = props
  const [check, setCheck] = useState(false)
  return (
    <CheckBox
      checked={check}
      onClick={() => {
        setCheck(prev => !prev)
      }}
      {...props}
    />
  )
}

CheckBox.defaultProps = {
  width: 15,
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
