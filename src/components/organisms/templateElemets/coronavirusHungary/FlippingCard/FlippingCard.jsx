import React, { useState, useEffect } from "react"
import { useSpring, animated as a } from "react-spring"
import styled from "styled-components"

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
  transition,
  toggle,
}) {
  const prevToggle = usePrevious(toggle)
  const [flipped, set] = useState(false)
  const currTransition = useSpring({
    config: { mass: 6, tension: 500, friction: 80 },
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
  })
  let transitionObject = currTransition
  if (
    prevToggle !== "undefined" &&
    toggle !== prevToggle &&
    flipped !== toggle
  ) {
    transitionObject = transition
  }
  const { opacity, transform } = transitionObject

  console.log(toggle, flipped, gridArea)

  return (
    <FlexContainer
      onClick={() => set(prev => !prev)}
      gridArea={gridArea}
      pos="relative"
    >
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
