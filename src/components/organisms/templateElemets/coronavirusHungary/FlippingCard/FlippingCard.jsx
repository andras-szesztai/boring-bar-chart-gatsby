import React, { useState } from "react"
import { useSpring, animated as a } from "react-spring"
import styled from "styled-components"

import { dropShadow, space } from "../../../../../themes/theme"
import { FlexContainer } from "../../../../atoms"

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

export default function FlippingCard({ front, back, gridArea }) {
  const [flipped, set] = useState(false)
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 8, tension: 500, friction: 80 },
  })

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
        {front}
      </Card>
      <Card style={{ opacity: opacity.interpolate(o => 1 - o), transform }}>
        {back}
      </Card>
    </FlexContainer>
  )
}
