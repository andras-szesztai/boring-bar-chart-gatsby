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

const SubContainer = styled.div`
  display: grid;
  width: 95%;
  height: 80%;

  grid-template-rows: 75px auto;
`

const ChartContainer = styled.div`
  display: grid;

  grid-template-rows: ${({ twoCharts }) =>
    twoCharts ? "auto 50px auto" : "auto 50px"};
`

const PlaceHolderDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
`

export default function MoviesDashboard() {
  const device = useDeviceType()

  const [ isBoth , setIsBoth ] = useState(false)
  const {
    state,
    prevState,
    actions,
    localStorageValues,
    localStorageSetters,
  } = moviesDashboardReducer()
  const { favoritePersons } = localStorageValues
  const { setFavoritePersons } = localStorageSetters
  const { dataSets } = state

  useEffect(() => {
    favoritePersons &&
      favoritePersons.length &&
      actions.setActiveNameID(_.last(favoritePersons).id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(prevState && state.setActiveNameID !== prevState.activeNameID){

    }
  }, [prevState, state])

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
            <SubContainer>
              <PlaceHolderDiv>Controls</PlaceHolderDiv>
              {dataSets.personCredits && (
                <ChartContainer
                  twoCharts={
                    !!dataSets.personCredits.cast.length &&
                    !!dataSets.personCredits.crew.length
                  }
                >
                  <PlaceHolderDiv>Chart</PlaceHolderDiv>
                  <PlaceHolderDiv>Time scale</PlaceHolderDiv>
                  {!!dataSets.personCredits.cast.length &&
                    !!dataSets.personCredits.crew.length && (
                      <PlaceHolderDiv>Chart</PlaceHolderDiv>
                    )}
                </ChartContainer>
              )}
            </SubContainer>
          </MainContainer>
        </div>
      )}
    </>
  )
}
