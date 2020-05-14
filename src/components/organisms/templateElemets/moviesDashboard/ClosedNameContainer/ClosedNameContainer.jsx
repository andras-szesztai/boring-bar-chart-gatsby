import React from "react"
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
import FavoriteStar from "../Icons/FavoriteStar"

const Container = styled(motion.div)`
  position: absolute;
  bottom: 12px;
  right: ${space[2]}px;
  font-size: ${themifyFontSize(3)};
  font-weight: 300;
  color: ${COLORS.primaryLight};
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

  return (
    <Container
      key="close-name"
      variants={OPACITY_VARIANT}
      onClick={setFavorites}
      {...ANIMATE_PROPS}
    >
      {dataSets.personDetails.name}
      <motion.div
        style={{
          marginLeft: 8,
          marginTop: 1,
        }}
        whileHover={{ scale: 1.3 }}
      >
        <FavoriteStar isFavorited={isFavorited} />
      </motion.div>
    </Container>
  )
}
