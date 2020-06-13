import { motion } from "framer-motion"
import styled from "styled-components"

import { dropShadow, space } from "../../../../../themes/theme"
import {
  TRANSITION,
  CARD_WIDTH,
  CARD_HEIGHT,
} from "../../../../../constants/moviesDashboard"
import { themifyZIndex } from "../../../../../themes/mixins"

export const variants = {
  initial: {
    y: "-100%",
  },
  animateFirst: {
    y: space[2],
    transition: TRANSITION.primary,
  },
  animateOpen: {
    y: space[2],
    transition: TRANSITION.primary,
  },
  animateClose: {
    y: -(CARD_HEIGHT.person * 0.75),
    transition: TRANSITION.primary,
  },
  exit: {
    y: "-100%",
  },
}

export const PersonDetailsCard = styled(motion.div)`
  position: fixed;

  background-color: #fff;
  filter: drop-shadow(${dropShadow.primary})
    drop-shadow(${dropShadow.secondary});
  border-radius: ${space[1]}px;

  right: ${space[2]}px;
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT.person}px;
  z-index: 5;
`

export const DetailCardContent = styled(motion.div)`
  position: relative;

  display: flex;
  justify-content: center;

  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT.person}px;
`

export const IconContainer = styled(motion.div)`
  position: absolute;
  left: ${space[2]}px;
  cursor: pointer;
  z-index: ${themifyZIndex("hoverOverlay")};
`

export const CardGrid = styled(motion.div)`
  display: flex;
  justify-content: space-between;

  padding: ${space[2]}px;

  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT.person - 40}px;
`

export const CardTextGrid = styled(motion.div)`
  display: grid;
  grid-template-rows: min-content 1fr;
`
