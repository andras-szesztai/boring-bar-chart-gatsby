import React, { useState, useEffect } from "react"
import _ from "lodash"
import { useMeasure, useWindowSize } from "react-use"

import { space } from "../../../../../themes/theme"
import { usePrevious } from "../../../../../hooks"
import ControlCollapsed from "./ControlCollapsed/ControlCollapsed"
import EndIconsContainer from "./EndIconsContainer/EndIconsContainer"
import ShadowRecentList from "./ShadowRecentList/ShadowRecentList"
import RecentList from "./RecentList/RecentList"
import { FIXED_DIMS } from "../../../../../constants/moviesDashboard"

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
  const prevIsOpen = usePrevious(isOpen)
  const [listRef, dims] = useMeasure()
  const prevDims = usePrevious(dims)

  const [elementDims, setElementDims] = useState([])

  const [hoveredFavorite, setHoveredFavorite] = useState(undefined)

  const { width } = useWindowSize()
  const maxWidth = width - 2 * space[2] - FIXED_DIMS.controlCollapsedWidth - 40

  const delay =
    !prevDims ||
    prevDims.width < dims.width ||
    isOpen !== prevIsOpen ||
    prevDims.width - dims.width === FIXED_DIMS.listItemGrowth
      ? 0
      : 650

  return (
    <>
      <ShadowRecentList
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
        delay={delay}
        elementDims={elementDims}
        setRunReCalc={setRunReCalc}
      />
      <ControlCollapsed isOpen={isOpen} />
      <EndIconsContainer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        maxWidth={maxWidth}
        dims={dims}
        delay={delay}
      />
    </>
  )
}
