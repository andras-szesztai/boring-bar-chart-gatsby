import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import chroma from "chroma-js"

import { space } from "../../../../../../themes/theme"

const RowItem = styled(motion.span)`
  color: #fff;
  padding: ${space[0]}px ${space[2]}px 1px ${space[2]}px;
  margin-right: ${space[2]}px;
  border-radius: 2px;
  white-space: nowrap;

  display: flex;
  justify-content: space-between;
`

export default function RowItemComponent({
  el,
  bgColor,
  itemHovered,
  setItemHovered,
  growBy,
  hiddenContent: HiddenContent,
}) {
  const delayedRevealProps = {
    animate: { opacity: 1, transition: { delay: 0.5 } },
    exit: {
      opacity: 0,
      transition: {
        duration: 0,
        type: "tween",
      },
    },
  }

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
      <div>{el}</div>
      <AnimatePresence>
        {itemHovered === el && (
          <motion.div initial={{ opacity: 0, y: -1.5 }} {...delayedRevealProps}>
            |
          </motion.div>
        )}
        {itemHovered === el && <HiddenContent animateProps={delayedRevealProps} />}
      </AnimatePresence>
    </RowItem>
  )
}

RowItemComponent.defaultProps = {
  hiddenContent: () => <div />,
}
