import styled, { css } from "styled-components"
import { motion } from "framer-motion"

import { dropShadow, space } from "../../../../../themes/theme"
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  HANDLE_SIZE,
  TRANSITION,
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
  width: ${HANDLE_SIZE}px;
  background-color: #fff;
  border-radius: ${space[1]}px 0 0 ${space[1]}px;
`

export const MovieDetailsCardRight = styled(MovieDetailsCard)`
  right: ${space[2]}px;
  :after {
    ${HandleStyle}
    bottom: 0px;
    height: ${HANDLE_SIZE}px;
    left: -${HANDLE_SIZE - 4}px;
    border-radius: ${space[1]}px 0 0 ${space[1]}px;
  }

  :before {
    ${HandleStyle}
    top: 0px;
    height: ${HANDLE_SIZE * 2}px;
    left: -${HANDLE_SIZE - 4}px;
    border-radius: ${space[1]}px 0 0 ${space[1]}px;
  }
`

export const MovieDetailsCardLeft = styled(MovieDetailsCard)`
  left: ${space[2]}px;

  :after {
    ${HandleStyle}
    bottom: 0px;
    right: ${-HANDLE_SIZE + 4}px;
    height: ${HANDLE_SIZE}px;
    border-radius: 0 ${space[1]}px ${space[1]}px 0;
  }

  :before {
    ${HandleStyle}
    top: 0px;
    right: ${-HANDLE_SIZE + 4}px;
    height: ${HANDLE_SIZE * 2}px;
    border-radius: 0 ${space[1]}px ${space[1]}px 0;
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

export const CloseIconContainerRight = styled(IconContainer)`
  left: -${HANDLE_SIZE - 4}px;
  top: ${CARD_HEIGHT.movie - HANDLE_SIZE}px;
`

export const CloseIconContainerLeft = styled(IconContainer)`
  left: ${CARD_WIDTH - 4}px;
  top: ${CARD_HEIGHT.movie - HANDLE_SIZE}px;
`

export const makeRightVariants = delay => ({
  initial: {
    x: CARD_WIDTH + HANDLE_SIZE,
  },
  animate: {
    x: 0,
    transition: {
      ...TRANSITION.primary,
      delay,
    },
  },
  exit: {
    x: CARD_WIDTH + HANDLE_SIZE + space[2],
    transition: {
      ...TRANSITION.primary,
    },
  },
})

export const makeLeftVariants = delay => ({
  initial: {
    x: -(CARD_WIDTH + HANDLE_SIZE),
  },
  animate: {
    x: 0,
    transition: {
      ...TRANSITION.primary,
      delay,
    },
  },
  exit: {
    x: -(CARD_WIDTH + HANDLE_SIZE + space[2]),
    transition: {
      ...TRANSITION.primary,
    },
  },
})

const IconsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  position: absolute;

  top: 0px;

  border-radius: 0 0 0 2px;
  width: ${HANDLE_SIZE}px;
  height: ${HANDLE_SIZE * 2}px;
  z-index: 4;

  .icon {
    cursor: pointer;
  }
`

export const IconsContainerRight = styled(IconsContainer)`
  left: -${HANDLE_SIZE - 4}px;
`

export const IconsContainerLeft = styled(IconsContainer)`
  right: -${HANDLE_SIZE - 4}px;
`
