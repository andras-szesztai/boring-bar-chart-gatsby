import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import chroma from "chroma-js"

import { space } from "../../../../../../themes/theme"

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
  growBy
}) {
  const [originalWidth, setOriginalListWidth] = useState(undefined)
  const itemRef = React.useRef(null)
  useEffect(() => {
    if (!originalWidth && itemRef.current) {
      setOriginalListWidth(itemRef.current.offsetWidth)
    }
  }, [el, originalWidth])
  return (
    <RowItem
      ref={itemRef}
      key={el}
      animate={{
        width: itemHovered === el ? originalWidth + growBy : originalWidth,
      }}
      onMouseEnter={() => setItemHovered(el)}
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${bgColor && chroma(bgColor).darken()}`,
      }}
    >
      {el}
    </RowItem>
  )
}
