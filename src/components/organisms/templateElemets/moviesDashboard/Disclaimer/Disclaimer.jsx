import React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import chroma from "chroma-js"
import { IoMdBuild } from "react-icons/io"

import {
  COLORS,
  OPACITY_VARIANT,
  ANIMATE_PROPS,
} from "../../../../../constants/moviesDashboard"
import { space } from "../../../../../themes/theme"
import { themifyFontSize } from "../../../../../themes/mixins"

const Overlay = styled(motion.div)`
  position: fixed;
  z-index: 100;
  height: ${({ height }) => (height ? `${height}px` : "100vh")};
  width: ${({ width }) => (width ? `${width}px` : "100vw")};

  background-color: ${chroma(COLORS.textColor).alpha(0.98)};
  padding: ${space[8]}px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #fff;
  font-size: ${({ size }) => themifyFontSize(size || 6)};
  font-weight: 200;
  text-align: center;

  .explain {
    margin-top: ${space[3]}px;
    font-size: ${themifyFontSize(2)};
  }
`

export default function Disclaimer({
  bigText,
  smallText,
  height,
  width,
  size,
}) {
  return (
    <Overlay
      height={height}
      width={width}
      size={size}
      variants={OPACITY_VARIANT}
      {...ANIMATE_PROPS}
    >
      <p>{bigText}</p>
      <p className="explain">{smallText}</p>
      <div style={{ marginTop: space[3] }}>
        <IoMdBuild size={30} color="#fff" />
      </div>
    </Overlay>
  )
}
