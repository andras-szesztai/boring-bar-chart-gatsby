import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import chroma from "chroma-js"

import { space } from "../../../../../../themes/theme"

import { useMeasure } from "react-use"

const RowItem = styled(motion.span)`
  color: #fff;
  padding: ${space[0]}px ${space[2]}px 1px ${space[2]}px;
  margin-right: ${space[2]}px;
  border-radius: 2px;
  white-space: nowrap;
`

export default function RowItemComponent({
  el,
  bgColor,
  itemHovered,
  setItemHovered,
}) {
  const [originalWidth, setOriginalListWidth] = useState(undefined)
  const [itemRef, dims] = useMeasure()
  useEffect(() => {
    if (!originalWidth && dims.width) {
      setOriginalListWidth(dims.width)
    }
  }, [dims, el, originalWidth])
  return (
    <RowItem
      ref={itemRef}
      animate={{
        width: itemHovered === el ? originalWidth + 100 : originalWidth,
      }}
      onMouseEnter={() => setItemHovered(el)}
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${chroma(bgColor).darken()}`,
      }}
    >
      {el}
    </RowItem>
  )
}
