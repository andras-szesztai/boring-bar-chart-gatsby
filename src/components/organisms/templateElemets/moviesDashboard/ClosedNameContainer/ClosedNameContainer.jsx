import React, { useRef } from "react"
import { motion } from "framer-motion"
import styled from "styled-components"
import chroma from "chroma-js"
import Reward from "react-rewards"
import { IoIosStar, IoIosStarOutline } from "react-icons/io"

// Styles
import { space } from "../../../../../themes/theme"
import { themifyFontSize } from "../../../../../themes/mixins"
import {
  COLORS,
  OPACITY_VARIANT,
  ANIMATE_PROPS,
} from "../../../../../constants/moviesDashboard"

const Container = styled(motion.div)`
  position: absolute;
  bottom: 12px;
  right: ${space[2]}px;
  font-size: ${themifyFontSize(3)};
  font-weight: 200;
  color: #fff;
  border-radius: ${space[1]}px;
  padding: 1px 12px;
  background-color: ${chroma(COLORS.primary)};
  border: 1px solid ${chroma(COLORS.primary).darken()};

  display: flex;
  cursor: pointer;
`

export default function ClosedNameContainer({
  dataSets,
  setFavorites,
  isFavorited,
}) {
  const rewardRef = useRef()
  const FavoriteIcon = isFavorited ? IoIosStar : IoIosStarOutline

  return (
    <Container
      key="close-name"
      variants={OPACITY_VARIANT}
      onClick={() => {
        !isFavorited && rewardRef.current.rewardMe()
        setFavorites()
      }}
      {...ANIMATE_PROPS}
    >
      {dataSets.personDetails.name}
      <div
        style={{
          marginLeft: 10,
          transform: "translateY(2px)",
        }}
      >
        <Reward
          ref={rewardRef}
          type="confetti"
          config={{
            lifetime: 90,
            angle: 90,
            decay: 0.9,
            spread: 150,
            startVelocity: 8,
            elementCount: 65,
            elementSize: 5,
            springAnimation: false,
            colors: Object.values(COLORS),
          }}
        >
          <FavoriteIcon size={22} color={COLORS.favorite} />
        </Reward>
      </div>
    </Container>
  )
}
