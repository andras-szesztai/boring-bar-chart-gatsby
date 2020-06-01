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

import { useDeviceType, usePrevious } from "../../hooks"
import {
  SearchBar,
  PersonDetailCard,
  FavoritesList,
  MovieSelectorChart,
} from "../organisms/templateElemets/moviesDashboard"
import { moviesDashboardReducer } from "../../reducers"

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
        </div>
      )}
    </>
  )
}
