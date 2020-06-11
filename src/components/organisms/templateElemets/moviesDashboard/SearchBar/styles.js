import styled from "styled-components"
import { motion } from "framer-motion"
import chroma from "chroma-js"

import { themifyZIndex, themifyFontSize } from "../../../../../themes/mixins"
import { COLORS, CARD_WIDTH } from "../../../../../constants/moviesDashboard"
import { space, fontFamily } from "../../../../../themes/theme"

export const SearchBarMainContainer = styled(motion.div)`
  position: fixed;
  left: ${space[2]}px;
  top: ${space[2]}px;
  z-index: 5;
`

export const SearchBarSubContainer = styled(motion.div)`
  position: relative;
  cursor: pointer;
`

export const StyledSearchBar = styled(motion.input)`
  z-index: ${themifyZIndex("hoverOverlay")};
  width: ${CARD_WIDTH - 50}px;
  height: 40px;
  border-radius: ${space[1]}px;
  background: ${COLORS.primary};
  color: ${chroma(COLORS.primary).brighten(3)};
  border: 1px solid ${chroma(COLORS.primary).darken()};
  font-family: ${fontFamily};
  font-size: ${themifyFontSize(2)};
  font-weight: 300;
  outline: none;

  padding-bottom: 2px;

  &::placeholder {
    font-weight: 300;
    color: ${chroma(COLORS.primary).brighten(3)};
    font-family: inherit;
  }
`

export const SearchIconContainer = styled(motion.div)`
  position: absolute;
  top: ${space[2]}px;
  left: ${space[2]}px;
  z-index: ${themifyZIndex("tooltip")};
  cursor: default;
`

export const CloseIconContainer = styled(motion.div)`
  position: absolute;
  top: ${space[2]}px;
  right: 5px;
  z-index: ${themifyZIndex("tooltip")};
`

export const SearchItemHover = styled(motion.div)`
  position: absolute;
  z-index: ${themifyZIndex("tooltip")};

  height: 70px;
  width: 100%;
  background-color: ${COLORS.primary};
  border: 1px solid ${chroma(COLORS.primary).darken(2)};
  border-radius: ${space[1]}px;
  pointer-events: none;
`

export const ResultsContainer = styled(motion.div)`
  position: absolute;
  z-index: -1;
  padding-top: 35px;
  top: 10px;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export const variants = {
  animate: {
    transition: {
      staggerChildren: 0.25,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.15,
      staggerDirection: -1,
    },
  },
}