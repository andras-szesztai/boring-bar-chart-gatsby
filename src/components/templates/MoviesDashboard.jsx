import React, { useEffect } from "react"
import { Helmet } from "react-helmet"
import last from "lodash/last"

import { useDeviceType } from "../../hooks"
import {
  PersonSearch,
  PersonDetailCard,
  FavoritesList,
  MovieSelectorChart,
  MovieDetailsCard,
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

  return (
    <>
      <Helmet title="Dashboard under construction" />
      {device === "desktop" && (
        <div style={{ userSelect: "none" }}>
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
          />
        </div>
      )}
    </>
  )
}
