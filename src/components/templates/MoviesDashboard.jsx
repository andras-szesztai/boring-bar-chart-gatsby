import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import _ from "lodash"
import { useUpdateEffect } from "react-use"
import isEqual from "lodash/isEqual"
import { scaleTime, scaleSqrt } from "d3-scale"
import { extent } from "d3-array"
import { IoIosArrowBack } from "react-icons/io"

import { useDeviceType, usePrevious } from "../../hooks"
import {
  SearchBar,
  PersonDetailCard,
  FavoritesList,
  MovieSelectorChart,
} from "../organisms/templateElemets/moviesDashboard"
import { moviesDashboardReducer } from "../../reducers"
import { dropShadow, space } from "../../themes/theme"
import { CARD_WIDTH, CARD_HEIGHT } from "../../constants/moviesDashboard"
import { themifyZIndex } from "../../themes/mixins"

const handleSize = space[6]

const MovieDetailsCard = styled(motion.div)`
  position: fixed;

  background-color: #fff;
  filter: drop-shadow(${dropShadow.primary})
    drop-shadow(${dropShadow.secondary});
  border-radius: ${space[1]}px;

  top: calc(50% - ${CARD_HEIGHT.movie / 2}px);
  right: ${space[2]}px;
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT.movie}px;
  z-index: 4;

  :after {
    content: "";
    position: absolute;
    z-index: 4;
    left: -${handleSize - 4}px;
    width: ${handleSize}px;
    height: ${handleSize}px;
    bottom: 0px;
    background-color: #fff;
    border-radius: ${space[1]}px 0 0 ${space[1]}px;
  }
`

const IconContainer = styled(motion.div)`
  position: relative;
  right: ${space[1]}px;
  cursor: pointer;
  width: ${handleSize}px;
  height: ${handleSize}px;
  z-index: ${themifyZIndex("hoverOverlay")};
  background-color: red;
`

export default function MoviesDashboard() {
  const device = useDeviceType()

  const {
    state,
    prevState,
    actions,
    localStorageValues,
    localStorageSetters,
  } = moviesDashboardReducer()
  const { favoritePersons } = localStorageValues
  const { setFavoritePersons } = localStorageSetters
  const { dataSets, activeNameID, activeMovie } = state
  const { setActiveMovie } = actions

  useEffect(() => {
    favoritePersons &&
      favoritePersons.length &&
      actions.setActiveNameID(_.last(favoritePersons).id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // console.log("MoviesDashboard -> state", state)
  return (
    <>
      <Helmet title="Dashboard under construction" />
      {device === "desktop" && (
        <div style={{ userSelect: "none" }}>
          <SearchBar setActiveNameID={actions.setActiveNameID} />
          <PersonDetailCard
            state={state}
            prevState={prevState}
            actions={actions}
            loading={state.loading.personDetails}
            favoritePersons={favoritePersons}
            setFavoritePersons={setFavoritePersons}
          />
          <FavoritesList
            state={state}
            actions={actions}
            localStorageValues={localStorageValues}
            localStorageSetters={localStorageSetters}
          />
          <MovieSelectorChart
            activeNameID={activeNameID}
            loading={state.loading}
            dataSets={dataSets}
            setActiveMovie={setActiveMovie}
            activeMovie={activeMovie}
          />
          <MovieDetailsCard>
            <IconContainer>Hello</IconContainer>
          </MovieDetailsCard>
        </div>
      )}
    </>
  )
}
