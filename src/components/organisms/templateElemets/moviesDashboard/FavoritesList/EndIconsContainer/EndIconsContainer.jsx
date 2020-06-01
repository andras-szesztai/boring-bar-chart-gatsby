import React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { IoIosArrowForward } from "react-icons/io"
import { animated, useSpring } from "react-spring"

import { space, dropShadow, colors } from "../../../../../../themes/theme"
import { themifyZIndex } from "../../../../../../themes/mixins"
import { COLORS, FIXED_DIMS } from "../../../../../../constants/moviesDashboard"

export const Container = styled(animated.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  z-index: 10;
  height: 60px;
  width: 35px;

  position: fixed;
  bottom: ${space[2]}px;
  background-color: #fff;

  filter: drop-shadow(${dropShadow.primary});
  border: 1px solid ${colors.whiteDark};
  border-radius: 0 ${space[1]}px ${space[1]}px 0;
`

const IconContainer = styled(motion.div)`
  right: ${space[1]}px;
  cursor: pointer;
  z-index: ${themifyZIndex("hoverOverlay")};
`

export default function EndIconsContainer({
  isOpen,
  setIsOpen,
  maxWidth,
  dims,
}) {
  const endContainerXPos = isOpen
    ? FIXED_DIMS.controlCollapsedWidth +
      10 +
      (dims.width <= maxWidth ? dims.width : maxWidth)
    : FIXED_DIMS.controlCollapsedWidth + 8

  const endContainerAnim = useSpring({
    from: {
      transform: `translate(${endContainerXPos}px, 100px)`,
    },
    transform: `translate(${endContainerXPos}px, 0px)`,
    boxShadow: `-1px 0px 3px 0 rgba(51,51,51,${isOpen ? 0.12 : 0})`,
  })

  return (
    <Container style={endContainerAnim}>
      <IconContainer
        role="button"
        style={{ transform: "translateY(5px)" }}
        onClick={() => setIsOpen(prev => !prev)}
        whileHover={{
          scale: 1.3,
          transition: {
            delay: 0,
          },
        }}
        initial={{ rotate: isOpen ? 180 : 0 }}
        animate={{
          rotate: isOpen ? 180 : 0,
          transition: {
            delay: 1,
          },
        }}
      >
        <IoIosArrowForward size={24} color={COLORS.textColor} />
      </IconContainer>
    </Container>
  )
}
