import React, { useState, useEffect } from "react"
import _ from "lodash"
import { useMeasure, useWindowSize } from "react-use"
import styled, { css } from "styled-components"
import { motion } from "framer-motion"
import { IoIosSearch } from "react-icons/io"

import { space, dropShadow } from "../../../../../themes/theme"
import { usePrevious } from "../../../../../hooks"
import ControlCollapsed from "./ControlCollapsed/ControlCollapsed"
import EndIconsContainer from "./EndIconsContainer/EndIconsContainer"
import ShadowRecentList from "./ShadowRecentList/ShadowRecentList"
import RecentList from "./RecentList/RecentList"
import { FIXED_DIMS, COLORS } from "../../../../../constants/moviesDashboard"
import HorizontalScrollList from "../HorizontalScrollList/HorizontalScrollList"
import { themifyFontSize } from "../../../../../themes/mixins"

const HoverContent = ({ animateProps, data, accessor }) => {
  console.log("HoverContent -> data", data)
  return (
    <motion.div initial={{ opacity: 0 }} {...animateProps}>
      {data.name}
    </motion.div>
  )
}

const Container = styled(motion.div)`
  position: fixed;
  left: ${space[2]}px;
  bottom: ${space[2]}px;
  background-color: #fff;
  border-radius: ${space[1]}px;
  width: calc(100vw - ${space[3]}px);
  filter: drop-shadow(${dropShadow.primary})
    drop-shadow(${dropShadow.secondary});
  height: 56px;

  display: grid;
  grid-template-columns: max-content 1fr;
  grid-column-gap: ${space[4]}px;

  font-size: ${themifyFontSize(2)};
  color: ${COLORS.textColor};
  z-index: 10;

  padding: ${space[2]}px ${space[3]}px;
`

const TextContainer = styled.div`
  display: flex;
  align-items: center;

  padding: ${space[2]}px;
`

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 75%;
  align-self: center;
  position: relative;
`

const MouseDownContent = ({ bgColor }) => {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        transform: "translate(5px, 0.5px)",
      }}
    >
      <IoIosSearch size={14} color={bgColor} />{" "}
      <div
        style={{
          transform: "translate(4px, -1px)",
        }}
      >
        Search
      </div>
    </div>
  )
}

export default function FavoritesList({
  actions,
  state,
  localStorageValues,
  localStorageSetters,
}) {
  const { favoritePersons } = localStorageValues
  const prevLocalStorageValues = usePrevious(localStorageValues)

  const [runReCalc, setRunReCalc] = useState(false)
  const [favoritesCombined, setFavoriteCombined] = useState(undefined)
  useEffect(() => {
    if (!favoritesCombined) {
      setFavoriteCombined(
        [...favoritePersons].sort((a, b) => new Date(b.date) - new Date(a.date))
      )
    }
    if (
      prevLocalStorageValues &&
      !_.isEqual(favoritePersons, prevLocalStorageValues.favoritePersons)
    ) {
      setFavoriteCombined(
        [...favoritePersons].sort((a, b) => new Date(b.date) - new Date(a.date))
      )
      if (
        favoritePersons.length > prevLocalStorageValues.favoritePersons.length
      ) {
        setRunReCalc(true)
      }
    }
  }, [favoritesCombined, favoritePersons, prevLocalStorageValues])

  const [isOpen, setIsOpen] = useState(false)
  const [listRef, dims] = useMeasure()

  const [elementDims, setElementDims] = useState([])

  const [hoveredFavorite, setHoveredFavorite] = useState(undefined)

  const { width } = useWindowSize()
  const maxWidth = width - 2 * space[2] - FIXED_DIMS.controlCollapsedWidth - 40

  console.log(favoritesCombined)
  //Make it fixed and look like the other lists
  return (
    <>
      <Container>
        <TextContainer>Your recent favorites</TextContainer>

        <HorizontalScrollList
          type="favorites"
          array={favoritesCombined}
          bgColor={COLORS.primary}
          hoverContent={HoverContent}
          mouseDownContent={MouseDownContent}
          activeNameID={state.activeNameID}
          setActiveNameID={actions.setActiveNameID}
        />
      </Container>

      {/* <ShadowRecentList
        listRef={listRef}
        favoritesCombined={favoritesCombined}
        elementDims={elementDims}
        setElementDims={setElementDims}
        hoveredFavorite={hoveredFavorite}
        runReCalc={runReCalc}
        setRunReCalc={setRunReCalc}
      />
      <RecentList
        setHoveredFavorite={setHoveredFavorite}
        hoveredFavorite={hoveredFavorite}
        favoritesCombined={favoritesCombined}
        activeNameID={state.activeNameID}
        setActiveNameID={actions.setActiveNameID}
        dims={dims}
        maxWidth={maxWidth}
        setFavoritePersons={localStorageSetters.setFavoritePersons}
        isOpen={isOpen}
        elementDims={elementDims}
        setRunReCalc={setRunReCalc}
      />
      <ControlCollapsed isOpen={isOpen} />
      <EndIconsContainer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        maxWidth={maxWidth}
        dims={dims}
      /> */}
    </>
  )
}
