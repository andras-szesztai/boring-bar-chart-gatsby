import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import _ from "lodash"
import { useUpdateEffect } from "react-use"
import isEqual from "lodash/isEqual"

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
    twoCharts ? "1fr 50px 1fr" : "1fr 50px"};
`

const PlaceHolderDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
`

export default function MoviesDashboard() {
  const device = useDeviceType()

  const [personType, setPersonType] = useState({
    isBoth: undefined,
    isActor: undefined,
  })
  const {
    state,
    prevState,
    actions,
    localStorageValues,
    localStorageSetters,
  } = moviesDashboardReducer()
  const { favoritePersons } = localStorageValues
  const { setFavoritePersons } = localStorageSetters
  const { dataSets, activeNameID } = state

  useEffect(() => {
    favoritePersons &&
      favoritePersons.length &&
      actions.setActiveNameID(_.last(favoritePersons).id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useUpdateEffect(() => {
    if (dataSets.personCredits) {
      const newIsBoth =
        !!dataSets.personCredits.cast.length &&
        !!dataSets.personCredits.crew.length
      const newIsActor =
        dataSets.personDetails.known_for_department === "Acting"
      if (
        typeof personType.isBoth == "undefined" ||
        personType.isBoth !== newIsBoth ||
        personType.isActor !== newIsActor
      ) {
        setPersonType({
          isBoth: newIsBoth,
          isActor: newIsActor,
        })
      }
    }
  })

  const [isTitleHovered, setIsTitleHovered] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

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
          {activeNameID && !state.loading.personCredits && (
            <MainContainer>
              <SubContainer>
                <PlaceHolderDiv>Controls</PlaceHolderDiv>
                {typeof personType.isBoth == "boolean" && (
                  <ChartContainer twoCharts={personType.isBoth}>
                    <BubbleChart
                      isActor={personType.isActor}
                      data={
                        personType.isActor
                          ? dataSets.personCredits.cast
                          : dataSets.personCredits.crew
                      }
                    />
                    <PlaceHolderDiv>Time scale</PlaceHolderDiv>
                    {personType.isBoth && (
                      <BubbleChart
                        isActor={!personType.isActor}
                        data={
                          personType.isActor
                            ? dataSets.personCredits.crew
                            : dataSets.personCredits.cast
                        }
                      />
                    )}
                  </ChartContainer>
                )}
              </SubContainer>
            </MainContainer>
          )}
        </div>
      )}
    </>
  )
}

// {/* <BubbleChart
//                       data={
//                         personType.isActor
//                           ? dataSets.personCredits.crew
//                           : dataSets.personCredits.cast
//                       }
//                     /> */}
