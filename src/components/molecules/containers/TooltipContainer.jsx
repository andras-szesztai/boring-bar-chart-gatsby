import React, { useRef, useEffect, useState } from "react"
import styled, { css } from "styled-components"
import _ from "lodash"
import { IoIosClose } from "react-icons/io"

import { FlexContainer } from "../../atoms"
import { useWindowDimensions, usePrevious } from "../../../hooks"
import {
  themifyZIndex,
  themifySpace,
  themifyColor,
  themifyTransition,
} from "../../../themes/mixins"

const ARROW_HEIGHT = 8

var timer

function setTooltipTimeout(func) {
  timer = setTimeout(function() {
    func()
  }, 500)
}

function stopTooltipTimeout() {
  clearTimeout(timer)
}

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

const TooltipContainer = styled(FlexContainer)`
  z-index: ${themifyZIndex("tooltip")};
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.12)) drop-shadow(0 1px 2px rgba(0,0,0,0.24));

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

const IconContainer = styled(FlexContainer)`
  .icon {
    fill: ${themifyColor("grayDarkest")};
    transition: fill ${themifyTransition("sm")};
  }
  :hover {
    .icon {
      fill: ${themifyColor("red")};
    }
  }
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
  isInteractive,
  bgColor,
  borderRadius,
  shouldClose,
  width,
  height,
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
            ? elLeft + (elWidth + ARROW_HEIGHT) + dx
            : elLeft - (tooltipWidth + ARROW_HEIGHT) - dx
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
            left: tooltipLeft,
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

  const [isVisible, setIsVisible] = useState()
  const [tooltipIsHoveredOver, setTooltipIsHoveredOver] = useState(false)
  const prevHoveredElement = usePrevious(hoveredElement)
  const prevTooltipIsHoveredOver = usePrevious(tooltipIsHoveredOver)
  const prevShouldClose = usePrevious(shouldClose)
  useEffect(() => {
    if (hoveredElement || tooltipIsHoveredOver) {
      isInteractive && stopTooltipTimeout()
      setIsVisible(true)
    }
    if (!hoveredElement && !tooltipIsHoveredOver) {
      isInteractive
        ? setTooltipTimeout(() => setIsVisible(false))
        : setIsVisible(false)
    }
    if (prevShouldClose && shouldClose) {
      setIsVisible(false)
    }
  }, [
    hoveredElement,
    isInteractive,
    prevHoveredElement,
    prevShouldClose,
    prevTooltipIsHoveredOver,
    shouldClose,
    tooltipIsHoveredOver,
  ])

  return (
    <TooltipContainer
      ref={tooltipRef}
      isVisible={isVisible}
      pos="fixed"
      height={height}
      width={width}
      top={tooltipPosition.top}
      left={tooltipPosition.left}
      bgColor={bgColor}
      arrowColor={arrowColor}
      borderRadius={borderRadius}
      arrowAtRight={arrowLeftRight && !tooltipPosition.arrowAtLeft}
      arrowAtLeft={arrowLeftRight && tooltipPosition.arrowAtLeft}
      arrowTowardsTop={arrowTowardsTop}
      arrowTowardsBottom={arrowTowardsBottom}
      onMouseEnter={() => {
        isInteractive && setTooltipIsHoveredOver(true)
      }}
      onMouseLeave={() => {
        isInteractive && setTooltipIsHoveredOver(false)
      }}
    >
      {isInteractive && tooltipIsHoveredOver && (
        <IconContainer
          cursor="pointer"
          absPos
          top={1}
          right={1}
          onClick={() => isInteractive && setIsVisible(false)}
        >
          <IoIosClose className="icon" size={20} />
        </IconContainer>
      )}
      {children}
    </TooltipContainer>
  )
}

Tooltip.defaultProps = {
  bgColor: "#ffffff",
  arrowColor: "#ffffff",
  dx: 0,
  dy: 0,
  borderRadius: 1,
}
