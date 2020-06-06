import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import chroma from "chroma-js"

import { space } from "../../../../../../themes/theme"

const Item = styled(motion.span)`
  color: #fff;
  padding: ${space[0]}px ${space[2]}px 1px ${space[2]}px;
  margin-right: ${space[2]}px;
  border-radius: 2px;
  white-space: nowrap;

  display: flex;
  justify-content: space-between;
`

const HiddenInformation = styled.div`
  opacity: 0;
  pointer-events: none;
  position: absolute;
  bottom: 0px;
  right: 0px;

  display: flex;
`

export default function ListItem({
  data,
  bgColor,
  itemHovered,
  setItemHovered,
  growBy,
  hiddenContent: HiddenContent,
  hiddenContentProps,
  handleMouseEnter,
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
  }, [originalWidth])

  const hiddenInformationRef = React.useRef(null)
  const [hiddenInformationWidth, setHiddenInformationWidth] = useState(0)
  useEffect(() => {
    if (
      hiddenContentProps &&
      hiddenContentProps.accessor &&
      !hiddenInformationWidth &&
      hiddenInformationRef.current
    ) {
      setHiddenInformationWidth(hiddenInformationRef.current.offsetWidth)
    }
  }, [hiddenContentProps, hiddenInformationWidth])
  itemHovered === data.id &&
    console.log(
      "hiddenInformationWidth",
      data.name,
      hiddenInformationWidth,
      data[hiddenContentProps.accessor]
    )

  return (
    <Item
      ref={itemRef}
      key={data.id}
      animate={{
        width:
          itemHovered === data.id
            ? originalWidth + hiddenInformationWidth
            : originalWidth,
      }}
      onMouseEnter={() => {
        handleMouseEnter && handleMouseEnter(hiddenInformationWidth)
        setItemHovered(data.id)
      }}
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${bgColor && chroma(bgColor).darken()}`,
      }}
    >
      <div>{data.name.trim()}</div>
      <AnimatePresence>
        {itemHovered === data.id && (
          <motion.div
            key="separate-line"
            initial={{ opacity: 0, y: -1.5 }}
            style={{ marginLeft: space[2], marginRight: space[2] }}
            {...delayedRevealProps}
          >
            |
          </motion.div>
        )}
        {itemHovered === data.id && (
          <HiddenContent
            key="content"
            animateProps={delayedRevealProps}
            data={data}
            {...hiddenContentProps}
          />
        )}
      </AnimatePresence>

      {hiddenContentProps && hiddenContentProps.accessor && (
        <HiddenInformation
          key={data.id + data[hiddenContentProps.accessor]}
          ref={hiddenInformationRef}
        >
          <div
            style={{
              marginLeft: space[2],
              marginRight: space[2],
              transform: "translateY(1.5px)",
            }}
          >
            |
          </div>
          <div>{data[hiddenContentProps.accessor].trim()}</div>
        </HiddenInformation>
      )}
    </Item>
  )
}

ListItem.defaultProps = {
  hiddenContent: () => <div />,
}
