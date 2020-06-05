import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

import { space } from "../../../../../themes/theme"
import { COLORS } from "../../../../../constants/moviesDashboard"

import { dentedStyling } from "../styles/styles"
import RowItem from "./ListItem/ListItem"

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
  position: relative;
`

const HiddenRowList = styled(RowList)`
  opacity: 0;
  pointer-events: none;
  position: absolute;
  bottom: 0px;
  right: 0px;
`

export default function HorizontalScrollList(props) {
  const { array, type, growBy } = props
  const [itemHovered, setItemHovered] = useState(false)

  const [originalWidth, setOriginalWidth] = useState(undefined)
  const listRef = React.useRef(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const newWidth = listRef.current && listRef.current.offsetWidth
    if (newWidth && originalWidth !== newWidth) {
      setOriginalWidth(newWidth)
    }
  })

  return (
    <>
      <RowListContainer onMouseLeave={() => setItemHovered(false)}>
        <RowList
          animate={{
            width: itemHovered ? originalWidth + growBy : originalWidth,
          }}
        >
          {array.map(el => (
            <RowItem
              key={`${el}-crew`}
              el={el}
              {...props}
              itemHovered={itemHovered}
              setItemHovered={setItemHovered}
            />
          ))}
        </RowList>
      </RowListContainer>
      <HiddenRowList ref={listRef}>
        {array.map(el => (
          <RowItem key={`${el}-${type}-hidden`} el={el} />
        ))}
      </HiddenRowList>
    </>
  )
}

HorizontalScrollList.defaultProps = {
  array: [],
  type: "list",
  growBy: 50,
  bgColor: COLORS.textColor
}
