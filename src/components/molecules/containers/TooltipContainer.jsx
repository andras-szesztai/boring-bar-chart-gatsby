import React, { useRef, useEffect, useState } from "react"
import styled, { css } from "styled-components"

import { GridContainer } from "../../atoms"
import { useWindowDimensions } from "../../../hooks"
import { themifyZIndex } from "../../../themes/mixins"

const TooltipContainer = styled(GridContainer)`
  z-index: ${themifyZIndex("tooltip")};
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
  const { windowWidth } = useWindowDimensions()
  const [dims, setDims] = useState({ width: undefined })
  const tooltipRef = useRef()
  useEffect(() => {
    if (tooltipRef && tooltipRef.current) {
      const newDims = tooltipRef.current.getBoundingClientRect()
      dims.width !== newDims.width && setDims(newDims)
    }
  }, [dims])

  let top, left, width, height
  if (hoveredElement) {
    top = hoveredElement.top
    left = hoveredElement.left
    width = hoveredElement.width
    height = hoveredElement.height
  }

  console.log(top, left, width, height)

  return (
    <TooltipContainer
      ref={tooltipRef}
      isVisible={hoveredElement}
      pos="fixed"
      withBorder
      top={top}
      left={left}
      bgColor="#fff"
    >
      {children}
    </TooltipContainer>
  )
}
