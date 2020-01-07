import React from "react"
import styled from "styled-components"

export const ChartSvg = styled.svg`
  width: ${props => props.width || 0}px;
  height: ${props => props.height || 0}px;
`

export default function(props) {
  return <ChartSvg {...props}>{props.children}</ChartSvg>
}
