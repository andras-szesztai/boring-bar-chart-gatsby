import React from "react"
import { motion } from "framer-motion"
import styled from "styled-components"
import { IoMdInformationCircle } from "react-icons/io"

import { space, dropShadow } from "../../../../../themes/theme"
import {
  HANDLE_SIZE,
  COLORS,
  TRANSITION,
} from "../../../../../constants/moviesDashboard"
import { TextContainer } from "../styles/styles"

const InformationContainer = styled(motion.div)`
  position: fixed;

  background-color: #fff;
  border-radius: ${space[1]}px;
  filter: drop-shadow(${dropShadow.primary})
    drop-shadow(${dropShadow.secondary});

  top: ${space[2]}px;
  left: 50%;
  transform: translateX(-50%);

  height: 100px;
  width: 200px;
  z-index: 5;
  padding: ${space[1]}px ${space[2]}px ${space[2]}px ${space[2]}px;

  display: flex;

  ::after {
    content: "";
    position: absolute;
    width: ${HANDLE_SIZE}px;
    height: ${HANDLE_SIZE}px;
    border-radius: 0 0 ${space[1]}px ${space[1]}px;
    background-color: #fff;
    bottom: -${HANDLE_SIZE - 2}px;
    right: 0px;
  }
`

const IconButton = styled(motion.button)`
  position: absolute;

  bottom: -${HANDLE_SIZE - 2}px;
  right: 0px;
  z-index: 6;

  cursor: pointer;
  width: ${HANDLE_SIZE}px;
  height: ${HANDLE_SIZE}px;

  background-color: #fff;
  border: none;
  border-radius: 0 0 ${space[1]}px ${space[1]}px;
`

const Text = styled(TextContainer)`
  display: grid;
  grid-template-rows: repeat(3, 1fr);

`

export default function InformationContainerComponent() {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <InformationContainer
      initial={{ opacity: 0, y: -100 }}
      animate={{
        opacity: 1,
        y: isOpen ? 0 : -100,
        transition: { ...TRANSITION.primary, stiffness: 140 },
      }}
    >
      <Text>

      </Text>

      <IconButton
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <motion.div animate={{ scale: isHovered ? 1.25 : 1 }}>
          <IoMdInformationCircle color={COLORS.textColor} size={28} />
        </motion.div>
      </IconButton>
    </InformationContainer>
  )
}
