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
  box-shadow: ${dropShadow.primary}, ${dropShadow.secondary};
`

export default function FlippingCard({
  front,
  back,
  gridArea,
  transition: groupTransition,
  toggle,
}) {
  const prevToggle = usePrevious(toggle)
  const [isFlipped, setIsFlipped] = useState(false)
  const currTransition = useSpring({
    config: { mass: 6, tension: 500, friction: 80 },
    opacity: isFlipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${isFlipped ? 180 : 0}deg)`,
  })
  const transitionObject = useRef(currTransition)
  useEffect(() => {
    transitionObject.current = currTransition
    if (
      prevToggle !== "undefined" &&
      toggle !== prevToggle &&
      toggle !== isFlipped
    ) {
      setIsFlipped(toggle)
      transitionObject.current = groupTransition
    }
  }, [
    prevToggle,
    toggle,
    isFlipped,
    transitionObject,
    groupTransition,
    currTransition,
  ])
  const { opacity, transform } = transitionObject.current

  const [resizeListener, sizes] = useResizeAware()

  console.log(sizes)
  return (
    <FlexContainer
      onClick={() => setIsFlipped(prev => !prev)}
      gridArea={gridArea}
      pos="relative"
    >
      {resizeListener}
      <Card
        style={{
          opacity,
          transform: transform.interpolate(t => `${t} rotateY(180deg)`),
        }}
      >
        {front} {gridArea}
      </Card>
      <Card style={{ opacity: opacity.interpolate(o => 1 - o), transform }}>
        {back} {gridArea}
      </Card>
    </FlexContainer>
  )
}
