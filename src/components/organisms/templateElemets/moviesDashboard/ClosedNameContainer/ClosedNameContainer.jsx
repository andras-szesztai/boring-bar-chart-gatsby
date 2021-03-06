import React, { useState } from "react"
import { motion } from "framer-motion"
import styled from "styled-components"
import chroma from "chroma-js"

import { space } from "../../../../../themes/theme"
import { themifyFontSize } from "../../../../../themes/mixins"
import {
  COLORS,
  ANIMATE_PROPS,
  makeOpacityVariant,
} from "../../../../../constants/moviesDashboard"
import { FavoriteStar } from "../../../../molecules"

const Container = styled(motion.div)`
  position: absolute;
  bottom: 12px;
  right: ${space[3]}px;
  font-size: ${themifyFontSize(3)};
  font-weight: 300;
  color: #fff;
  border-radius: ${space[1]}px;
  padding: 2px 16px;
  background-color: ${chroma(COLORS.primary)};
  border: 1px solid ${chroma(COLORS.primary).darken()};
  white-space: nowrap;

  display: flex;
  cursor: pointer;
  padding-right: 45px;
`

export default function ClosedNameContainer({
  dataSets,
  setFavorites,
  isFavorited,
}) {
  const [isTitleHovered, setIsTitleHovered] = useState(false)

  return (
    <Container
      key="close-name"
      variants={makeOpacityVariant({ startDelay: 0.5 })}
      onClick={setFavorites}
      onMouseEnter={() => setIsTitleHovered(true)}
      onMouseLeave={() => setIsTitleHovered(false)}
      {...ANIMATE_PROPS}
    >
      <span>{dataSets.personDetails.name}</span>
      <motion.div
        style={{
          position: "absolute",
          right: 5,
        }}
        animate={{
          scale: isTitleHovered ? 1.2 : 1,
        }}
      >
        <FavoriteStar
          color={COLORS.favorite}
          isFavorited={isFavorited}
          isHovered={isTitleHovered}
        />
      </motion.div>
    </Container>
  )
}
