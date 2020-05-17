import React, { useState } from "react"
import { motion } from "framer-motion"
import styled from "styled-components"
import chroma from "chroma-js"

// Styles
import { space } from "../../../../../themes/theme"
import { themifyFontSize } from "../../../../../themes/mixins"
import {
  COLORS,
  OPACITY_VARIANT,
  ANIMATE_PROPS,
} from "../../../../../constants/moviesDashboard"
import { FavoriteStar } from "../../../../molecules"

const Container = styled(motion.div)`
  position: absolute;
  bottom: 12px;
  right: ${space[2]}px;
  font-size: ${themifyFontSize(3)};
  font-weight: 300;
  color: #fff;
  border-radius: ${space[1]}px;
  padding: 1px 12px;
  background-color: ${chroma(COLORS.primary)};
  border: 1px solid ${chroma(COLORS.primary).darken()};

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
      variants={OPACITY_VARIANT}
      onClick={setFavorites}
      onMouseEnter={() => setIsTitleHovered(true)}
      onMouseLeave={() => setIsTitleHovered(false)}
      {...ANIMATE_PROPS}
    >
      {dataSets.personDetails.name}
      <motion.div
        style={{
          position: "absolute",
          right: 5,
        }}
        animate={{
          scale: isTitleHovered ? 1.2 : 1,
        }}
      >
        <FavoriteStar isFavorited={isFavorited} isHovered={isTitleHovered} />
      </motion.div>
    </Container>
  )
}
