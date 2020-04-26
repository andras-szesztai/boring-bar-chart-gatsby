import React, { useState, useEffect, useRef } from "react"
import { useSpring, animated as a } from "react-spring"
import styled from "styled-components"
import useResizeAware from "react-resize-aware"

import { dropShadow, space } from "../../../../../themes/theme"
import { FlexContainer } from "../../../../atoms"
import { usePrevious } from "../../../../../hooks"

const Card = styled(a.div)`
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: ${space[1]}px;

  display: grid;

  background-color: #fff;
  cursor: pointer;
  will-change: transform, opacity;
  filter: drop-shadow(${dropShadow.primary})
    drop-shadow(${dropShadow.secondary});

  transform-style: preserve-3d;
  backface-visibility: hidden;
`

export default function FlippingCard(props) {
  const {
    transition: groupTransition,
    toggle: parentIsFlipped,
    handleClick,
  } = props
  const prevParentIsFlipped = usePrevious(parentIsFlipped)
  const [isFlipped, setIsFlipped] = useState(false)
  const currTransition = useSpring({
    config: { mass: 6, tension: 500, friction: 80 },
    transform: isFlipped ? 180 : 0,
  })
  const transitionObject = useRef(currTransition)
  useEffect(() => {
    transitionObject.current = currTransition
    if (
      prevParentIsFlipped !== "undefined" &&
      parentIsFlipped !== prevParentIsFlipped &&
      parentIsFlipped !== isFlipped
    ) {
      setIsFlipped(parentIsFlipped)
      transitionObject.current = groupTransition
    }
  }, [
    prevParentIsFlipped,
    parentIsFlipped,
    isFlipped,
    transitionObject,
    groupTransition,
    currTransition,
  ])
  const { transform } = transitionObject.current

  const [resizeListener, sizes] = useResizeAware()
  const rotateDirection = sizes.height > sizes.width ? "rotateY" : "rotateX"

  return (
    <FlexContainer
      onClick={() => {
        _.isFunction(handleClick) && handleClick()
        props.fullCardIsClickable && setIsFlipped(prev => !prev)
      }}
      gridArea={props.gridArea}
      pos="relative"
      zIndex={props.zIndex}
    >
      {resizeListener}
      <Card
        style={{
          transform: transform.interpolate(
            t =>
              `perspective(${props.perspective}px) ${rotateDirection}(${t}deg)`
          ),
        }}
      >
        {props.frontContent}
      </Card>
      <Card
        style={{
          transform: transform.interpolate(
            t =>
              ` perspective(${props.perspective}px) ${rotateDirection}(${t}deg) ${rotateDirection}(180deg)`
          ),
        }}
      >
        {props.backContent}
      </Card>
    </FlexContainer>
  )
}
