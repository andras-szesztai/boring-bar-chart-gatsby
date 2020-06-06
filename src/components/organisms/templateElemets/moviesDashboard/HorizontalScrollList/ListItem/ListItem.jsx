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
  overflow: hidden;
`

export default function ListItem({
  data,
  bgColor,
  itemHovered,
  setItemHovered,
  hoverContent: HoverContent,
  hoverContentProps,
  mouseDownContent: MouseDownContent,
  handleMouseEnter,
  activeNameID,
  setActiveNameID,
}) {
  const delayedRevealProps = {
    animate: { opacity: 1, transition: { delay: 0.35 } },
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
      hoverContentProps &&
      hoverContentProps.accessor &&
      !hiddenInformationWidth &&
      hiddenInformationRef.current
    ) {
      setHiddenInformationWidth(hiddenInformationRef.current.offsetWidth)
    }
  }, [hoverContentProps, hiddenInformationWidth])

  const [isClicked, setIsClicked] = useState()
  const timeOut = React.useRef(false)

  return (
    <Item
      ref={itemRef}
      animate={{
        width:
          itemHovered === data.id
            ? originalWidth + hiddenInformationWidth
            : originalWidth,
      }}
      onMouseLeave={() => {
        setIsClicked(false)
      }}
      onMouseEnter={() => {
        handleMouseEnter && handleMouseEnter(hiddenInformationWidth)
        HoverContent && setItemHovered(data.id)
      }}
      onMouseDown={() => {
        if (activeNameID && activeNameID !== data.id) {
          setIsClicked(true)
          timeOut.current = setTimeout(
            () => setActiveNameID({ id: data.id, isActiveMovieClicked: true }),
            1000
          )
        }
      }}
      onMouseUp={() => {
        clearTimeout(timeOut.current)
        setIsClicked(false)
      }}
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${bgColor && chroma(bgColor).darken()}`,
        cursor:
          activeNameID && activeNameID !== data.id ? "pointer" : "default",
      }}
    >
      <AnimatePresence>
        {activeNameID && activeNameID !== data.id && (
          <MouseDownAnimation
            initial={{
              width: 0,
              zIndex: 1,
              color: bgColor,
            }}
            animate={{
              width: isClicked ? originalWidth + hiddenInformationWidth - 2 : 0,
            }}
            exit={{
              width: 0,
            }}
            transition={{
              duration: isClicked ? 1 : 0.25,
              type: "tween",
              ease: [0.65, 0, 0.35, 1],
            }}
          >
            <MouseDownContent />
          </MouseDownAnimation>
        )}
      </AnimatePresence>
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
          <HoverContent
            key="content"
            animateProps={delayedRevealProps}
            data={data}
            {...hoverContentProps}
          />
        )}
      </AnimatePresence>

      {hoverContentProps && hoverContentProps.accessor && (
        <HiddenInformation
          key={data.id + data[hoverContentProps.accessor]}
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
          <div>{data[hoverContentProps.accessor].trim()}</div>
        </HiddenInformation>
      )}
    </Item>
  )
}

ListItem.defaultProps = {
  hiddenContent: () => <div />,
  mouseDownContent: () => <div />,
}
