import React, { useState } from "react"
import styled, { css } from "styled-components"

const CheckBox = styled.div`
  ${({ width }) =>  css`
  
  `}

  /* input[type="checkbox"] {
    position: relative;
    cursor: pointer;
    appearance: none;
    font-size: inherit;
    width: 1em;
    margin: 0;
    color: inherit;
    outline: none;
    transition: 300ms ease-out; */
/* 
    &::after {
      content: "\f111";
      display: inline-block;
      text-align: center;
      width: 1em;
    } */

    /* &:checked::after {
      font-weight: 900;
    }
    &:active {
      transform: scale(0.6);
    }

    + span {
      margin-left: 0.35em;
    } */
  }

  /* input[type="checkbox"]:checked::after {
    content: "\f058";
  }

  input[type="radio"]:checked::after {
    content: "\f192";
  } */

  /* input[type="checkbox"]:after {
    content: "\f0c8";
  }
  input[type="checkbox"]:checked::after {
    content: "\f14a";
  } */
`

export default function(props) {
  const { value } = props
  const [check, setCheck] = useState(false)
  return (
    <CheckBox
      {...props}
    />
  )
}

CheckBox.defaultProps = {
  width: 25
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
