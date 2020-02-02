import React, { useRef, useEffect, useState } from "react"
import styled, { css } from "styled-components"
import _ from "lodash"

import { GridContainer } from "../../atoms"
import { useWindowDimensions, usePrevious } from "../../../hooks"
import { themifyZIndex, themifySpace } from "../../../themes/mixins"

const ARROW_HEIGHT = 8

const arrowPosHorizontal = (arrowTowardsLeft, arrowTowardsRight) =>
  arrowTowardsLeft
    ? `${themifySpace(3)}px`
    : arrowTowardsRight
    ? `calc(100% - ${themifySpace(3)}px)`
    : "50%"

const arrowPosVertical = (arrowTowardsTop, arrowTowardsBottom) =>
  arrowTowardsTop
    ? `${themifySpace(3)}px`
    : arrowTowardsBottom
    ? `calc(100% - ${themifySpace(3)}px)`
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

  ${({ arrowAtTop, arrowTowardsLeft, arrowTowardsRight, arrowColor }) =>
    arrowAtTop &&
    css`
      :after {
        bottom: 100%;
        left: ${arrowPosHorizontal(arrowTowardsLeft, arrowTowardsRight)};
        ${arrowStyle}
        border-bottom-color: ${arrowColor};
        margin-left: -${themifySpace(2)}px;
      }
    `}

  ${({ arrowAtBottom, arrowTowardsLeft, arrowTowardsRight, arrowColor }) =>
    arrowAtBottom &&
    css`
      :after {
        top: 100%;
        left: ${arrowPosHorizontal(arrowTowardsLeft, arrowTowardsRight)};
        ${arrowStyle}
        border-top-color: ${arrowColor};
        margin-left: -${themifySpace(2)}px;
      }
    `}

    ${({ arrowAtRight, arrowTowardsTop, arrowTowardsBottom, arrowColor }) =>
      arrowAtRight &&
      css`
        :after {
          left: 100%;
          top: ${arrowPosVertical(arrowTowardsTop, arrowTowardsBottom)};
          ${arrowStyle}
          border-left-color: ${arrowColor};
          margin-top: -${themifySpace(2)}px;
        }
      `}

      ${({ arrowAtLeft, arrowTowardsTop, arrowTowardsBottom, arrowColor }) =>
        arrowAtLeft &&
        css`
        :after {
          right: 100%;
          top: ${arrowPosVertical(arrowTowardsTop, arrowTowardsBottom)};
          ${arrowStyle}
          border-right-color: ${arrowColor};
          margin-top: -${themifySpace(2)}px;
        }
      `}

`

export default function Tooltip({
  hoveredElement,
  children,
  arrowColor,
  arrowLeftRight,
  arrowTopBottom,
  arrowTowardsTop,
  arrowTowardsBottom,
  dy,
  dx,
}) {
  const { windowWidth } = useWindowDimensions()
  const [tooltipDims, setTooltipDims] = useState({ width: undefined })
  const tooltipRef = useRef()
  useEffect(() => {
    if (tooltipRef && tooltipRef.current) {
      const newDims = tooltipRef.current.getBoundingClientRect()
      tooltipDims.width !== newDims.width && setTooltipDims(newDims)
    }
  }, [tooltipDims])

  const [tooltipPosition, setTooltipPosition] = useState({
    top: undefined,
    left: undefined,
    arrowAtRight: undefined,
  })

  const prevHooveredElement = usePrevious(hoveredElement)
  useEffect(() => {
    if (!_.isEqual(hoveredElement, prevHooveredElement)) {
      let elTop, elLeft, elWidth, elHeight, tooltipLeft, tooltipTop
      if (hoveredElement) {
        const { top, left, width, height } = hoveredElement
        const { width: tooltipWidth, height: tooltipHeight } = tooltipDims
        elTop = top
        elLeft = left
        elWidth = width
        elHeight = height
        // Only calculate tooltipLeft, tooltipBottom if hoveredElement
        if (arrowLeftRight) {
          const isLessThanMiddle = left <= windowWidth / 2
          const tooltipLeft = isLessThanMiddle
            ? elLeft + (elWidth + ARROW_HEIGHT)
            : elLeft - (tooltipWidth + ARROW_HEIGHT)
          let tooltipTop
          // Where to position the top?
          if (arrowTowardsTop) {
            tooltipTop = elTop
          }
          if (arrowTowardsBottom) {
            tooltipTop = elTop - tooltipHeight
          }
          if (!arrowTowardsTop && !arrowTowardsBottom) {
            tooltipTop = elTop - tooltipHeight / 2
          }

          setTooltipPosition({
            top: tooltipTop + dy,
            left: tooltipLeft + dx,
            arrowAtLeft: isLessThanMiddle,
          })
        }

        // TODO:
        // if (arrowTopBottom) {
        // }
      }
    }
  }, [
    hoveredElement,
    prevHooveredElement,
    tooltipDims,
    arrowLeftRight,
    arrowTopBottom,
    windowWidth,
    arrowTowardsTop,
    arrowTowardsBottom,
    dy,
    dx,
  ])

  return (
    <TooltipContainer
      ref={tooltipRef}
      isVisible={hoveredElement}
      pos="fixed"
      height="100px"
      width="200px"
      top={tooltipPosition.top}
      left={tooltipPosition.left}
      bgColor="#fff"
      arrowColor={arrowColor}
      arrowAtRight={arrowLeftRight && !tooltipPosition.arrowAtLeft}
      arrowAtLeft={arrowLeftRight && tooltipPosition.arrowAtLeft}
      arrowTowardsTop={arrowTowardsTop}
      arrowTowardsBottom={arrowTowardsBottom}
    >
      {children}
    </TooltipContainer>
  )
}

Tooltip.defaultProps = {
  bgColor: "#fff",
  arrowColor: "#fff",
  dx: 0,
  dy: 0,
}
