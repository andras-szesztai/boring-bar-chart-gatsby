import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion"
import chroma from "chroma-js"

import { space } from "../../../../../themes/theme"
import { COLORS } from "../../../../../constants/moviesDashboard"

import { dentedStyling } from "../styles/styles"
import ListItem from "./ListItem/ListItem"

const ListContainer = styled(motion.div)`
  justify-self: stretch;
  margin-top: 0px;
  ${dentedStyling}
  border-radius: 2px;
  padding: ${space[1]}px ${space[2]}px;
  overflow-x: auto;

  display: flex;
  ::-webkit-scrollbar {
    height: ${space[1]}px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: ${COLORS.backgroundGray};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${({ color }) => color};
    border-radius: 2px;

    :hover {
      background: ${({ color }) => chroma(color).darken()};
    }
  }
`

const List = styled(motion.div)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
`

const HiddenList = styled(List)`
  opacity: 0;
  pointer-events: none;
  position: absolute;
  bottom: 0px;
  right: 0px;
`

export default function HorizontalScrollList(props) {
  const { array, type, withAnimation } = props
  const [itemHovered, setItemHovered] = useState(false)

  const [originalWidth, setOriginalWidth] = useState(undefined)
  const listRef = React.useRef(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const newWidth = listRef.current && listRef.current.offsetWidth
    if (newWidth && originalWidth !== newWidth) {
      setOriginalWidth(newWidth + 20)
    }
  })

  const extraWidth = React.useRef(0)

  return (
    <>
      <ListContainer
        color={props.bgColor}
        onMouseLeave={() => setItemHovered(false)}
      >
        {withAnimation ? (
          <AnimateSharedLayout>
            <List
              animate={{
                width: itemHovered
                  ? originalWidth + extraWidth.current
                  : originalWidth,
              }}
            >
              <AnimatePresence>
                {!!array.length &&
                  array.map(el => {
                    return (
                      <motion.span key={`${el.id}-${type}`} animate>
                        <ListItem
                          withAnimation={withAnimation}
                          data={el}
                          itemHovered={itemHovered}
                          setItemHovered={setItemHovered}
                          handleMouseEnter={width =>
                            (extraWidth.current = width)
                          }
                          {...props}
                          layoutId="list-item"
                        />
                      </motion.span>
                    )
                  })}
              </AnimatePresence>
            </List>
          </AnimateSharedLayout>
        ) : (
          <List
            animate={{
              width: itemHovered
                ? originalWidth + extraWidth.current
                : originalWidth,
            }}
          >
            {!!array.length &&
              array.map(el => {
                return (
                  <ListItem
                    withAnimation={withAnimation}
                    key={`${el.id}-${type}`}
                    data={el}
                    itemHovered={itemHovered}
                    setItemHovered={setItemHovered}
                    handleMouseEnter={width => (extraWidth.current = width)}
                    {...props}
                    layoutId="list-item"
                    isActiveMovieClicked={props.isActiveMovieClicked}
                  />
                )
              })}
          </List>
        )}
      </ListContainer>
      <HiddenList ref={listRef}>
        {!!array.length &&
          array.map(el => (
            <ListItem key={`${el.id}-${type}-hidden`} data={el} />
          ))}
      </HiddenList>
    </>
  )
}

HorizontalScrollList.defaultProps = {
  array: [],
  type: "list",
  growBy: 50,
  bgColor: COLORS.textColor,
}
