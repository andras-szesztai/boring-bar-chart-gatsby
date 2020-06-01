import styled, { css } from "styled-components"
import { motion } from "framer-motion"

import { dropShadow, space } from "../../../../../themes/theme"
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  HANDLE_SIZE
} from "../../../../../constants/moviesDashboard"
import { themifyZIndex } from "../../../../../themes/mixins"


const MovieDetailsCard = styled(motion.div)`
  position: fixed;
  background-color: #fff;
  filter: drop-shadow(${dropShadow.primary})
    drop-shadow(${dropShadow.secondary});
  border-radius: ${space[1]}px;
  top: calc(50% - ${CARD_HEIGHT.movie / 2}px);
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT.movie}px;
  z-index: 4;
`

const HandleStyle = css`
  content: "";
  position: absolute;
  z-index: 4;
  bottom: 0px;
  width: ${HANDLE_SIZE}px;
  height: ${HANDLE_SIZE}px;
  background-color: #fff;
  border-radius: ${space[1]}px 0 0 ${space[1]}px;
`

export const MovieDetailsCardRight = styled(MovieDetailsCard)`
  right: ${space[2]}px;
  :after {
    ${HandleStyle}
    left: -${HANDLE_SIZE - 4}px;
  }
`

export const MovieDetailsCardLeft = styled(MovieDetailsCard)`
  left: ${space[2]}px;
  :after {
    ${HandleStyle}
    right: ${-HANDLE_SIZE + 4}px;
  }
`

const IconContainer = styled(motion.div)`
  position: relative;
  cursor: pointer;
  z-index: 4;
  top: ${CARD_HEIGHT.movie - HANDLE_SIZE}px;
  width: ${HANDLE_SIZE}px;
  height: ${HANDLE_SIZE}px;
  z-index: ${themifyZIndex("hoverOverlay")};

  display: flex;
  justify-content: center;
  align-items: center;
`

export const ArrowIconContainerRight = styled(IconContainer)`
  left: -${HANDLE_SIZE - 4}px;
  top: ${CARD_HEIGHT.movie - HANDLE_SIZE * 2}px;
`

export const ArrowIconContainerLeft = styled(IconContainer)`
  left: ${CARD_WIDTH - 4}px;
  top: ${CARD_HEIGHT.movie - HANDLE_SIZE * 2}px;
`

export const CloseIconContainer = styled(IconContainer)`
  top: 0px;
  left: ${CARD_WIDTH - HANDLE_SIZE}px;
`