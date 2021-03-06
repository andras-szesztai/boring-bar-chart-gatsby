import styled, { css } from "styled-components"
import { motion } from "framer-motion"
import chroma from "chroma-js"

import { themifyFontSize } from "../../../../../themes/mixins"
import { CARD_WIDTH } from "../../../../../constants/moviesDashboard"
import { space, fontFamily } from "../../../../../themes/theme"

export const SearchBarMainContainer = styled.div`
  position: fixed;
  left: ${space[2]}px;
  top: ${space[2]}px;
  z-index: ${({z}) => z};
`

export const SearchBarSubContainer = styled(motion.div)`
  position: relative;
  cursor: pointer;
  z-index: ${({z}) => z};
`

export const StyledSearchBar = styled(motion.input)`
  width: ${CARD_WIDTH - 50}px;
  height: 40px;
  border-radius: ${space[1]}px;
    color: #FFF;

  ${({ color }) => css`
    background: ${color};
    border: 1px solid ${chroma(color).darken()};
  `}
  
  font-family: ${fontFamily};
  font-size: ${themifyFontSize(2)};
  font-weight: 300;
  outline: none;

  padding-bottom: 2px;

  &::placeholder {
    font-weight: 300;
    font-family: inherit;
    color: #FFF;   
  }
`

export const SearchIconContainer = styled(motion.div)`
  position: absolute;
  top: ${space[2]}px;
  left: ${space[2]}px;
  cursor: default;
  z-index: ${({z}) => z + 1};
`

export const CloseIconContainer = styled(motion.div)`
  position: absolute;
  top: ${space[2]}px;
  right: 5px;
  z-index: ${({z}) => z + 1};
`

export const SearchItemHover = styled(motion.div)`
  position: absolute;
  z-index: ${({z}) => z + 1};

  height: 70px;
  width: 100%;
  border-radius: ${space[1]}px;
  pointer-events: none;

  ${({ color }) => css`
    background-color: ${color};
    border: 1px solid ${chroma(color).darken(2)};
  `}
`

export const ResultsContainer = styled(motion.div)`
  position: absolute;
  padding-top: 35px;
  top: 10px;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: -1;
`

export const variants = {
  initial: {
    pointerEvents: "auto",
  },
  animate: {
    pointerEvents: "auto",
    transition: {
      staggerChildren: 0.25,
    },
  },
  exit: {
    pointerEvents: "none",
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
}
