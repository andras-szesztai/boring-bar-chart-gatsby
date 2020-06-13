import React from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import chroma from "chroma-js"

import {
  COLORS,
  OPACITY_VARIANT,
  ANIMATE_PROPS,
} from "../../../../../constants/moviesDashboard"
import { space } from "../../../../../themes/theme"
import { themifyFontSize } from "../../../../../themes/mixins"
import { useWindowDimensions } from "../../../../../hooks"

const Overlay = styled(motion.div)`
  position: fixed;
  z-index: 100;
  width: 100vw;
  height: 100vh;

  background-color: ${chroma(COLORS.textColor).alpha(0.98)};
  padding: ${space[8]}px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #fff;
  font-size: ${themifyFontSize(6)};
  font-weight: 200;
  text-align: center;

  .explain {
    margin-top: ${space[3]}px;
    font-size: ${themifyFontSize(2)};
  }
`

export default function Disclaimer({ bigText, smallText }) {
  return (
    <Overlay variants={OPACITY_VARIANT} {...ANIMATE_PROPS}>
      <p>
        {bigText}
      </p>
      <p className="explain">
        Please set your browser's width bigger if possible, or open it on a
        wider screen, thank you!
      </p>
    </Overlay>
  )
}
