import React, { useState, useEffect } from "react"
import _ from "lodash"
import { useMeasure, useWindowSize } from "react-use"
import { useSpring, useTransition } from "react-spring"

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
  const { setFavoritePersons } = localStorageSetters
  const prevLocalStorageValues = usePrevious(localStorageValues)
  const { setActiveNameID } = actions

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
  const prevElementDims = usePrevious(elementDims)
  const [hoveredFavorite, setHoveredFavorite] = useState(undefined)

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

  const { width } = useWindowSize()
  const maxWidth = width - 2 * space[2] - FIXED_DIMS.controlCollapsedWidth - 40

  const endContainerXPos = isOpen
    ? FIXED_DIMS.controlCollapsedWidth +
      10 +
      (dims.width <= maxWidth ? dims.width : maxWidth)
    : FIXED_DIMS.controlCollapsedWidth + 8

  const delay =
    !prevDims ||
    prevDims.width < dims.width ||
    isOpen !== prevIsOpen ||
    prevDims.width - dims.width === FIXED_DIMS.listItemGrowth
      ? 0
      : 650
  const endContainerAnim = useSpring({
    from: {
      transform: `translate(${endContainerXPos}px, 100px)`,
    },
    transform: `translate(${endContainerXPos}px, 0px)`,
    boxShadow: `-1px 0px 3px 0 rgba(51,51,51,${isOpen ? 0.12 : 0})`,
    delay,
  })
  const recentListAnim = useSpring({
    width: `${isOpen ? dims.width + 5 : 0}px`,
    delay,
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
        recentListAnim={recentListAnim}
        setHoveredFavorite={setHoveredFavorite}
        hoveredFavorite={hoveredFavorite}
        favoritesCombined={favoritesCombined}
        placeholderAnim={placeholderAnim}
        transitions={transitions}
        activeNameID={state.activeNameID}
        setActiveNameID={setActiveNameID}
        dims={dims}
        maxWidth={maxWidth}
        setFavoritePersons={setFavoritePersons}
      />
      <ControlCollapsed isOpen={isOpen} />
      <EndIconsContainer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        endContainerAnim={endContainerAnim}
      />
    </>
  )
}
