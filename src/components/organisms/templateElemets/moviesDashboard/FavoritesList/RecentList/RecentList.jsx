import React, { useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import styled from "styled-components"
import { IoIosSearch, IoIosClose } from "react-icons/io"
import _ from "lodash"
import { useSpring, useTransition } from "react-spring"

import { space } from "../../../../../../themes/theme"
import {
  RecentListContainer,
  TextContainer,
  ListItemContainer,
} from "../styles"
import { usePrevious } from "../../../../../../hooks"
import { FIXED_DIMS } from "../../../../../../constants/moviesDashboard"

export const DisplayRecentListContainer = styled(RecentListContainer)`
  z-index: 1;
  height: 50px;
  bottom: ${space[2] + 5}px;
  max-width: calc(100vw - 2 * ${space[2]}px - 200px - 35px);

  ::-webkit-scrollbar {
    display: none;
    -ms-overflow-style: none;
  }
`

export const HoveredControlsContainer = styled(motion.div)`
  display: flex;
  justify-content: space-evenly;

  width: 166px;
  margin-left: 14px;
  border-left: 1px solid #fff;
`

export const HoverControlIconContainer = styled(motion.div)`
  position: relative;
  display: flex;

  cursor: pointer;
`

export const MouseDownAnimation = styled(motion.div)`
  position: absolute;

  top: 0;
  left: 0;
  height: 100%;

  background-color: #fff;
  opacity: 0.25;
  border-radius: ${space[1]}px;

  cursor: pointer;
`

const SearchControl = ({
  activeNameID,
  id,
  setActiveNameID,
  timeOut,
  clickedSearch,
  setClickedSearch,
}) => {
  const [isSearchHovered, setIsSearchHovered] = useState(false)

  return (
    <HoverControlIconContainer
      style={{
        color: activeNameID === id && "rgba(255, 255, 255, .25)",
      }}
      onMouseEnter={() => {
        if (activeNameID !== id) {
          setIsSearchHovered(true)
        }
      }}
      onMouseLeave={() => {
        clearTimeout(timeOut)
        setClickedSearch(undefined)
        setIsSearchHovered(false)
      }}
      onMouseDown={() => {
        if (activeNameID !== id) {
          setClickedSearch(id)
          timeOut = setTimeout(() => setActiveNameID(id), 1000)
        }
      }}
      onMouseUp={() => {
        clearTimeout(timeOut)
        setClickedSearch(undefined)
      }}
      whileTap={
        activeNameID === id && {
          x: 3,
          transition: {
            flip: Infinity,
            duration: 0.2,
            ease: [0.65, 0, 0.35, 1],
          },
        }
      }
    >
      {activeNameID !== id && (
        <MouseDownAnimation
          initial={{ width: "0%", x: -5 }}
          animate={{
            width: clickedSearch && clickedSearch === id ? "120%" : "0%",
          }}
          transition={{
            duration: 1,
            type: "tween",
            ease: [0.65, 0, 0.35, 1],
          }}
        />
      )}
      <motion.div
        style={{ marginRight: 4 }}
        initial={{ y: 2 }}
        animate={{ scale: isSearchHovered ? 1.4 : 1 }}
      >
        <IoIosSearch size={14} />
      </motion.div>
      Search
    </HoverControlIconContainer>
  )
}

const RemoveControl = ({
  id,
  timeOut,
  setFavoritePersons,
  clickedRemove,
  setClickedRemove,
}) => {
  const [isRemoveHovered, setIsRemoveHovered] = useState(false)

  return (
    <HoverControlIconContainer
      onMouseEnter={() => setIsRemoveHovered(true)}
      onMouseLeave={() => {
        clearTimeout(timeOut)
        setClickedRemove(undefined)
        setIsRemoveHovered(false)
      }}
      onMouseDown={() => {
        setClickedRemove(id)
        timeOut = setTimeout(
          () => setFavoritePersons(prev => prev.filter(d => d.id !== id)),
          1000
        )
      }}
      onMouseUp={() => {
        clearTimeout(timeOut)
        setClickedRemove(undefined)
      }}
    >
      <MouseDownAnimation
        initial={{ width: "0%", x: -5 }}
        animate={{
          width: clickedRemove && clickedRemove === id ? "120%" : "0%",
        }}
        transition={{
          duration: 1,
          type: "tween",
          ease: [0.65, 0, 0.35, 1],
        }}
      />
      <motion.div
        style={{ marginRight: 2 }}
        initial={{ y: 2 }}
        animate={{ scale: isRemoveHovered ? 1.6 : 1 }}
      >
        <IoIosClose size={14} />
      </motion.div>
      Remove
    </HoverControlIconContainer>
  )
}

export default function RecentList({
  setHoveredFavorite,
  hoveredFavorite,
  favoritesCombined,
  activeNameID,
  setActiveNameID,
  dims,
  maxWidth,
  setFavoritePersons,
  isOpen,
  delay,
  elementDims,
  setRunReCalc,
}) {
  const prevElementDims = usePrevious(elementDims)

  const [clickedRemove, setClickedRemove] = useState(undefined)
  const [clickedSearch, setClickedSearch] = useState(undefined)

  const timeOut = useRef(null)

  const recentListAnim = useSpring({
    width: `${isOpen ? dims.width + 5 : 0}px`,
    delay,
  })

  const xPosAdjust = FIXED_DIMS.controlCollapsedWidth + 12
  const transitions = useTransition(elementDims, item => item.name, {
    from: { opacity: 0, transform: "translate3d(-200px, 2px, 0)" },
    enter: item => ({
      opacity: 1,
      transform: `translate3d(${elementDims.find(el => el.name === item.name)
        .x - xPosAdjust}px, 2px, 0)`,
    }),
    update: item => {
      const curreItem = elementDims.find(el => el.name === item.name)
      return {
        transform: `translate3d(${curreItem.x - xPosAdjust}px, 2px, 0)`,
        width: `${curreItem.width}px`,
      }
    },
    leave: item => ({
      transform: `translate3d(${prevElementDims.find(
        el => el.name === item.name
      ).x - xPosAdjust}px, 100px, 0)`,
    }),
    onDestroyed: () => setRunReCalc(true),
  })

  const placeholderAnim = useSpring({
    left: `${
      _.last(elementDims)
        ? _.last(elementDims).x -
          (hoveredFavorite && hoveredFavorite.name === _.last(elementDims).name
            ? 20
            : 140)
        : 10
    }px`,
  })

  return (
    <DisplayRecentListContainer
      style={recentListAnim}
      onMouseLeave={() => {
        setHoveredFavorite(undefined)
        setClickedRemove(undefined)
      }}
    >
      <div style={{ position: "relative" }}>
        {favoritesCombined &&
          (!favoritesCombined.length ? (
            <TextContainer style={{ fontWeight: 300, alignSelf: "center" }}>
              {/* TODO: Mark a movie/series or person as a favorite to display them here! */}
              Mark a person as a favorite to start your list!
            </TextContainer>
          ) : (
            transitions.map(({ item, props, key }, i) => (
              <ListItemContainer
                key={key}
                style={{
                  ...props,
                  position: "absolute",
                }}
                onMouseEnter={() => {
                  setHoveredFavorite(item)
                  setClickedRemove(undefined)
                }}
              >
                {item.name}
                <AnimatePresence>
                  {hoveredFavorite && hoveredFavorite.name === item.name && (
                    <HoveredControlsContainer
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.6 } }}
                      exit={{
                        opacity: 0,
                        transition: {
                          duration: 0,
                          type: "tween",
                        },
                      }}
                    >
                      <SearchControl
                        activeNameID={activeNameID}
                        setActiveNameID={setActiveNameID}
                        id={item.id}
                        timeOut={timeOut.current}
                        clickedSearch={clickedSearch}
                        setClickedSearch={setClickedSearch}
                      />
                      <RemoveControl
                        id={item.id}
                        timeOut={timeOut.current}
                        setFavoritePersons={setFavoritePersons}
                        clickedRemove={clickedRemove}
                        setClickedRemove={setClickedRemove}
                      />
                    </HoveredControlsContainer>
                  )}
                </AnimatePresence>
              </ListItemContainer>
            ))
          ))}
        {dims.width > maxWidth && (
          <ListItemContainer
            style={{ ...placeholderAnim, position: "absolute", opacity: 0 }}
          />
        )}
      </div>
    </DisplayRecentListContainer>
  )
}
