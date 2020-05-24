import React, { useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import styled from "styled-components"
import { IoIosSearch, IoIosClose } from "react-icons/io"

import { space } from "../../../../../../themes/theme"
import {
  RecentListContainer,
  TextContainer,
  ListItemContainer,
} from "../styles"

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

export default function RecentList({
  recentListAnim,
  setHoveredFavorite,
  hoveredFavorite,
  favoritesCombined,
  placeholderAnim,
  transitions,
  activeNameID,
  setActiveNameID,
  dims,
  maxWidth,
  setFavoritePersons
}) {
  const [clickedRemove, setClickedRemove] = useState(undefined)
  const [clickedSearch, setClickedSearch] = useState(undefined)

  const timeOut = useRef(null)

  const [isRemoveHovered, setIsRemoveHovered] = useState(false)
  const [isSearchHovered, setIsSearchHovered] = useState(false)

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
              Mark a movie/series or person as a favorite to display them here!
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
                      <HoverControlIconContainer
                        style={{
                          color:
                            activeNameID === item.id &&
                            "rgba(255, 255, 255, .25)",
                        }}
                        onMouseEnter={() => {
                          if (activeNameID !== item.id) {
                            setIsSearchHovered(true)
                          }
                        }}
                        onMouseLeave={() => {
                          clearTimeout(timeOut.current)
                          setClickedSearch(undefined)
                          setIsSearchHovered(false)
                        }}
                        onMouseDown={() => {
                          if (activeNameID !== item.id) {
                            setClickedSearch(item.id)
                            timeOut.current = setTimeout(
                              () => setActiveNameID(item.id),
                              1000
                            )
                          }
                        }}
                        onMouseUp={() => {
                          clearTimeout(timeOut.current)
                          setClickedSearch(undefined)
                        }}
                        whileTap={
                          activeNameID === item.id && {
                            x: 3,
                            transition: {
                              flip: Infinity,
                              duration: 0.2,
                              ease: [0.65, 0, 0.35, 1],
                            },
                          }
                        }
                      >
                        {activeNameID !== item.id && (
                          <MouseDownAnimation
                            initial={{ width: "0%", x: -5 }}
                            animate={{
                              width:
                                clickedSearch && clickedSearch === item.id
                                  ? "120%"
                                  : "0%",
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
                      <HoverControlIconContainer
                        onMouseEnter={() => setIsRemoveHovered(true)}
                        onMouseLeave={() => {
                          clearTimeout(timeOut.current)
                          setClickedRemove(undefined)
                          setIsRemoveHovered(false)
                        }}
                        onMouseDown={() => {
                          setClickedRemove(item.id)
                          timeOut.current = setTimeout(
                            () =>
                              setFavoritePersons(prev =>
                                prev.filter(d => d.id !== item.id)
                              ),
                            1000
                          )
                        }}
                        onMouseUp={() => {
                          clearTimeout(timeOut.current)
                          setClickedRemove(undefined)
                        }}
                      >
                        <MouseDownAnimation
                          initial={{ width: "0%", x: -5 }}
                          animate={{
                            width:
                              clickedRemove && clickedRemove === item.id
                                ? "120%"
                                : "0%",
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
