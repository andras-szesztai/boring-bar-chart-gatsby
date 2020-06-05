import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

import { space } from "../../../../../themes/theme"

import { dentedStyling } from "../styles/styles"
import { useMeasure } from "react-use"
import RowItemComponent from "./ListItem/ListItem"

const RowListContainer = styled(motion.div)`
  justify-self: stretch;
  margin-top: 0px;
  ${dentedStyling}
  border-radius: 2px;
  padding: ${space[1]}px ${space[2]}px;
  overflow-x: auto;

  ::-webkit-scrollbar {
    display: none;
  }
`

const RowList = styled(motion.div)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const RowItem = styled(motion.span)`
  color: #fff;
  padding: ${space[0]}px ${space[2]}px 1px ${space[2]}px;
  margin-right: ${space[2]}px;
  border-radius: 2px;
  white-space: nowrap;
`

export default function HorizontalScrollList({ array, bgColor }) {
  const [itemHovered, setItemHovered] = useState(false)

  const [originalListWidth, setOriginalListWidth] = useState(undefined)
  const listRef =  React.useRef(null)
  useEffect(() => {
    if (!originalListWidth && listRef.current) {
      setOriginalListWidth(listRef.current.offsetWidth)
    }
  }, [originalListWidth])

  return (
    <RowListContainer onMouseLeave={() => setItemHovered(false)}>
      <RowList
        animate={{
          width: itemHovered ? originalListWidth + 200 : originalListWidth,
        }}
        ref={listRef}
      >
        {array.map(el => (
          <RowItemComponent
            key={`${el}-crew`}
            el={el}
            bgColor={bgColor}
            itemHovered={itemHovered}
            setItemHovered={setItemHovered}
          />
        ))}
      </RowList>
    </RowListContainer>
  )
}
