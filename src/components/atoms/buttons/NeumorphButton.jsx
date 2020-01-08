import React from "react"
import styled, { css } from "styled-components"
import { themifyFontSize, themifyFontWeight } from "../../../themes/mixins"

const Button = styled.div`
  position: relative;

  ${({ width, height, fontSize, fontWeight }) => css`
    width: ${width}px;
    height: ${height}px;
    font-size: ${themifyFontSize(fontSize)};
    font-weight: ${themifyFontWeight(fontWeight)};
  `}

  /* box-shadow: 9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px  rgba(255,255,255, 0.6); */

  box-shadow: inset 1px 1px 4px rgb(163,177,198,0.6), inset -1px -1px 4px  rgba(255,255,255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;

  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
`

const Underline = styled.div`
  ${({ width, height, fontSize, fontWeight }) => css`
    width: ${width * .7}px;
    height: ${height * .6}px;
    font-size: ${themifyFontSize(fontSize)};
    font-weight: ${themifyFontWeight(fontWeight)};
  `}

  background: #333;
  color: #E5E5E5;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 15px;
  border: 1px solid black;
`

export default function(props) {
  return (
    <Button {...props}>
      <Underline {...props}>{props.text}</Underline>
    </Button>
  )
}

Button.defaultProps = {
  width: 50,
  height: 50,
  fontSize: 1,
  fontWeight: 5,
}
