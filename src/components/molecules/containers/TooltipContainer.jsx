import React, { useRef, useEffect, useState } from "react"
import styled, { css } from "styled-components"

import { GridContainer } from "../../atoms"
import { useWindowDimensions } from "../../../hooks"
import { themifyZIndex, themifySpace } from "../../../themes/mixins"

const arrowPosHorizontal = (arrowTowardsLeft, arrowTowardsRight) =>
  arrowTowardsLeft
    ? `${themifySpace(2)}px`
    : arrowTowardsRight
    ? `calc(100% - ${themifySpace(2)}px)`
    : "50%"

const arrowPosVertical = (arrowTowardsTop, arrowTowardsBottom) =>
  arrowTowardsTop
    ? `${themifySpace(2)}px`
    : arrowTowardsBottom
    ? `calc(100% - ${themifySpace(2)}px)`
    : "50%"

const arrowStyle = css`
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border-width: ${themifySpace(2)}px;
`

const TooltipContainer = styled(GridContainer)`
  z-index: ${themifyZIndex("tooltip")};
  filter: drop-shadow(1px 1px 3px rgba(51, 51, 51, 0.45));
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

  ${({ arrowAtTop, arrowTowardsLeft, arrowTowardsRight }) =>
    arrowAtTop &&
    css`
      :after {
        bottom: 100%;
        left: ${arrowPosHorizontal(arrowTowardsLeft, arrowTowardsRight)};
        ${arrowStyle}
        border-bottom-color: #88b7d5;
        margin-left: -${themifySpace(2)}px;
      }
    `}

  ${({ arrowAtBottom, arrowTowardsLeft, arrowTowardsRight }) =>
    arrowAtBottom &&
    css`
      :after {
        top: 100%;
        left: ${arrowPosHorizontal(arrowTowardsLeft, arrowTowardsRight)};
        ${arrowStyle}
        border-top-color: #88b7d5;
        margin-left: -${themifySpace(2)}px;
      }
    `}

    ${({ arrowAtRight, arrowTowardsTop, arrowTowardsBottom   }) =>
      arrowAtRight &&
      css`
        :after {
          left: 100%;
          top: ${arrowPosVertical(arrowTowardsTop, arrowTowardsBottom )};
          ${arrowStyle}
          border-left-color: #88b7d5;
          margin-top: -${themifySpace(2)}px;
        }
      `}

`

export default function Tooltip({ hoveredElement, children }) {
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

  return (
    <TooltipContainer
      ref={tooltipRef}
      isVisible={hoveredElement}
      pos="fixed"
      withBorder
      width={dims.width}
      height="100px"
      top={top}
      left={left}
      bgColor="#fff"
    >
      {children}
    </TooltipContainer>
  )
}

Tooltip.defaultProps = {
  bgColor: "#fff",
}
