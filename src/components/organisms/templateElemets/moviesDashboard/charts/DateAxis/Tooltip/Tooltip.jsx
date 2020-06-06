import React from "react"
import styled, { css } from "styled-components"

const TooltipContainer = styled.div`
  position: absolute;
`

export default function Tooltip({ id, data, xPosition, yPosition }) {
  return <TooltipContainer></TooltipContainer>
}
