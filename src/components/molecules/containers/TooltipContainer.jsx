import React, { useRef, useEffect } from "react"
import styled, { css } from "styled-components"

import { GridContainer } from "../../atoms"

const TooltipContainer = styled(GridContainer)`
  ${({ isVisible }) =>
    isVisible
      ? css`
          opacity: 1;
          pointer-events: auto;
        `
      : css`
          opacity: 0;
          pointer-events: none;
        `}
`

export default function({ hoveredElement, children }) {
  

  const tooltipRef = useRef()
  useEffect(() => {
    if(tooltipRef && tooltipRef.current){
      console.log(tooltipRef.current.getBoundingClientRect())
    }
  })

  return (
    <TooltipContainer
      ref={tooltipRef}
      isVisible={hoveredElement}
      pos="fixed"
      // withBorder
      top={10}
      left={10}
    >
      {children}
    </TooltipContainer>
  )
}
