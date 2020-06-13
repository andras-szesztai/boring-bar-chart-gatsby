import React from "react"
import { motion } from "framer-motion"
import styled from "styled-components"
import { space, dropShadow } from "../../../../../themes/theme"

const InformationContainer = styled(motion.div)`
  position: fixed;

  background-color: #fff;
  border-radius: ${space[1]}px;
  filter: drop-shadow(${dropShadow.primary})
    drop-shadow(${dropShadow.secondary});

  top: ${space[2]}px;
  left: 50%;
  transform: translateX(-50%);

  height: 50px;
  width: 50px;
  z-index: 5;

  display: flex;
`

export default function InformationContainerComponent() {
  return <InformationContainer>Hello</InformationContainer>
}
