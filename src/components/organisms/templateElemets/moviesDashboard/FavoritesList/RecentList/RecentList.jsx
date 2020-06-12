import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import styled from "styled-components"
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
import SearchControl from "./SearchControl/SearchControl"
import RemoveControl from "./RemoveControl/RemoveControl"

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
  setHoveredFavorite,
  hoveredFavorite,
  favoritesCombined,
  activeNameID,
  setActiveNameID,
  dims,
  maxWidth,
  setFavoritePersons,
  isOpen,
  elementDims,
  setRunReCalc,
}) {
  const prevElementDims = usePrevious(elementDims)

  const [clickedRemove, setClickedRemove] = useState(undefined)
  const [clickedSearch, setClickedSearch] = useState(undefined)

  const recentListAnim = useSpring({
    width: `${isOpen ? dims.width + 5 : 0}px`,
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
      <div style={{ position: "relative", width: "100%" }}>
        <AnimatePresence>
          {!!favoritesCombined && !favoritesCombined.length && !!isOpen && (
            <TextContainer
              initial={{ opacity: 0, transform: "translateX(-100px)" }}
              animate={{
                opacity: 1,
                transform: "translateX(0px)",
                transition: { delay: 0.5 },
              }}
              exit={{ opacity: 0, transition: { duration: 0, delay: 0 } }}
              style={{ fontWeight: 300, alignSelf: "stretch" }}
            >
              Mark a person as your favorite to start the list!
            </TextContainer>
          )}
        </AnimatePresence>
        {!!favoritesCombined &&
          !!favoritesCombined.length &&
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
                      id={item.id}
                      clickedSearch={clickedSearch}
                      setClickedSearch={setClickedSearch}
                      activeNameID={activeNameID}
                      setActiveNameID={setActiveNameID}
                    />
                    <RemoveControl
                      id={item.id}
                      clickedRemove={clickedRemove}
                      setClickedRemove={setClickedRemove}
                      setFavoritePersons={setFavoritePersons}
                    />
                  </HoveredControlsContainer>
                )}
              </AnimatePresence>
            </ListItemContainer>
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
