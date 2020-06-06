import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { IoIosSearch } from "react-icons/io"
import chroma from "chroma-js"

import { space } from "../../../../../../themes/theme"

const Item = styled(motion.span)`
  position: relative;
  padding: ${space[0]}px ${space[2]}px 1px ${space[2]}px;
  margin-right: ${space[2]}px;
  border-radius: 2px;
  white-space: nowrap;

  display: flex;
  justify-content: space-between;

  color: #fff;
  cursor: pointer;
`

const HiddenInformation = styled.div`
  opacity: 0;
  pointer-events: none;
  position: absolute;
  bottom: 0px;
  right: 0px;

  display: flex;
`

export const MouseDownAnimation = styled(motion.div)`
  position: absolute;

  top: 0;
  left: 0;
  height: 100%;

  background-color: #fff;
  border-radius: 2px;

  cursor: pointer;
  color: red;
  overflow: hidden;
`

export default function ListItem({
  data,
  bgColor,
  itemHovered,
  setItemHovered,
  hiddenContent: HiddenContent,
  hiddenContentProps,
  handleMouseEnter,
  activeNameID,
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

  const [isClicked, setIsClicked] = useState()
  const timeOut = React.useRef(false)

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
      onMouseDown={() => {
        if (activeNameID !== data.id) {
          setIsClicked(true)
          //timeOut.current = setTimeout(() => setActiveNameID({ id }), 1000)
        }
      }}
      onMouseUp={() => {
        // clearTimeout(timeOut.current)
        setIsClicked(false)
      }}
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${bgColor && chroma(bgColor).darken()}`,
      }}
    >
      {activeNameID !== data.id && (
        <MouseDownAnimation
          initial={{
            width: 0,
            zIndex: 1,
          }}
          animate={{
            width: isClicked ? originalWidth + hiddenInformationWidth - 2 : 0,
          }}
          transition={{
            duration: 1,
            type: "tween",
            ease: [0.65, 0, 0.35, 1],
          }}
        >
          <div style={{ display: "flex", transform: "translate(5px, 2px)" }}>
            <IoIosSearch size={16} color={bgColor} /> Search
          </div>
        </MouseDownAnimation>
      )}
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
