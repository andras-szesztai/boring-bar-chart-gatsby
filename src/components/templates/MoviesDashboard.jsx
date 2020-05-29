import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import _ from "lodash"

import { useDeviceType, usePrevious } from "../../hooks"
import {
  SearchBar,
  PersonDetailCard,
  FavoritesList,
} from "../organisms/templateElemets/moviesDashboard"
import { moviesDashboardReducer } from "../../reducers"
import { BubbleChart } from "../organisms/templateElemets/moviesDashboard/charts"

const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;

  display: flex;
  justify-content: center;
  align-items: center;

  user-select: none;
`

const ChartContainer = styled.div`
  display: grid;
  width: 95%;
  height: 80%;

  grid-template-rows: 
`
//grid-template-rows:${({ twoCharts }) => twoCharts ? ""}
const PlaceHolderDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
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

  useEffect(() => {
    favoritePersons &&
      favoritePersons.length &&
      actions.setActiveNameID(_.last(favoritePersons).id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [isTitleHovered, setIsTitleHovered] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  console.log("MoviesDashboard -> state", state)
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
          <MainContainer>
            <ChartContainer>
              <PlaceHolderDiv>Controls</PlaceHolderDiv>
              {state.dataSets.personCredits && (
                <>
                  <BubbleChart />
                  <PlaceHolderDiv>Time scale</PlaceHolderDiv>
                  <PlaceHolderDiv>Chart</PlaceHolderDiv>
                </>
              )}
            </ChartContainer>
          </MainContainer>
        </div>
      )}
    </>
  )
}
