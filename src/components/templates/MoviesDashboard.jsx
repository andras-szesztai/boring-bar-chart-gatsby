import React, { useEffect } from "react"
import { Helmet } from "react-helmet"
import last from "lodash/last"
import { AnimatePresence } from "framer-motion"

import { useDeviceType, useWindowDimensions } from "../../hooks"
import {
  PersonSearch,
  PersonDetailCard,
  FavoritesList,
  MovieSelectorChart,
  MovieDetailsCard,
  InformationContainer,
  Disclaimer,
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
  const { favoritePersons, favoriteMovies } = localStorageValues
  const { setFavoritePersons, setFavoriteMovies } = localStorageSetters
  const { dataSets, activeNameID, activeMovie } = state
  const { setActiveMovie, setActiveNameID } = actions

  const isInit = React.useRef(true)
  useEffect(() => {
    if (isInit.current) {
      favoritePersons &&
        favoritePersons.length &&
        actions.setActiveNameID({ id: last(favoritePersons).id })
      isInit.current = false
    }
  }, [actions, favoritePersons])

  const { windowWidth, windowHeight } = useWindowDimensions()

  return (
    <>
      <Helmet title="The Filmography Explorer" />
      {device === "desktop" && (
        <div style={{ userSelect: "none" }}>
          <AnimatePresence>
            {!isNaN(windowWidth) && windowWidth < 1000 && (
              <Disclaimer
                bigText="Sorry, the dashboard has not yet been optimized for smaller screen size."
                smallText="Please set your browser's width bigger if possible, or open it on a
        wider screen, thank you!"
              />
            )}
          </AnimatePresence>
          <PersonSearch setActiveNameID={actions.setActiveNameID} />
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
            favoriteMovies={favoriteMovies}
          />
          <MovieDetailsCard
            activeMovie={activeMovie}
            prevActiveMovie={prevState && prevState.activeMovie}
            setActiveMovie={setActiveMovie}
            genreList={state.dataSets.genres}
            activeNameID={activeNameID}
            setActiveNameID={setActiveNameID}
            setFavoriteMovies={setFavoriteMovies}
            favoriteMovies={favoriteMovies}
          />
          <InformationContainer />
        </div>
      )}
      {(device === "mobile" || device === "tablet") && (
        <Disclaimer
          bigText={`Sorry, the dashboard has not yet been optimized for ${
            device === "mobile" ? "mobile devices" : "tablet"
          }.`}
          smallText={`Please open it in your desktop browser until ${
            device === "mobile" ? "mobile" : "tablet"
          } layout will be added!`}
          height={windowHeight}
          width={windowWidth}
          size={device === "mobile" ? 4 : 5}
        />
      )}
    </>
  )
}
