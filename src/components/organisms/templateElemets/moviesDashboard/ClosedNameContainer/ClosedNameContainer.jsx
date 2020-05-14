import React, { useRef } from "react"
import { motion } from "framer-motion"
import styled from "styled-components"
import { space } from "../../../../../themes/theme"
import { themifyFontSize } from "../../../../../themes/mixins"
import chroma from "chroma-js"
import Reward from "react-rewards"
import { IoIosStar, IoIosStarOutline } from "react-icons/io"

import {
  COLORS,
  OPACITY_VARIANT,
  ANIMATE_PROPS,
} from "../../../../../constants/moviesDashboard"
import { useLocalStorage } from "../../../../../hooks"

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

export default function ClosedNameContainer({ dataSets }) {
  const rewardRef = useRef()
  const [favorites, setFavorites] = useLocalStorage("favorites", [])
  const isFavorited =
    favorites &&
    dataSets.personDetails &&
    favorites.includes(dataSets.personDetails.id)
  const FavoriteIcon = isFavorited ? IoIosStar : IoIosStarOutline

  return (
    <Container
      key="close-name"
      variants={OPACITY_VARIANT}
      onClick={() => {
        if (isFavorited) {
          rewardRef.current.punishMe()
          setFavorites(
            favorites.filter(id => +id !== +dataSets.personDetails.id)
          )
        } else {
          rewardRef.current.rewardMe()
          setFavorites([...favorites, dataSets.personDetails.id])
        }
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
            elementCountelementCount: 65,
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
