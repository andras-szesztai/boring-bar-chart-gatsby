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
import {
  BubbleChart,
  DateAxis,
} from "../organisms/templateElemets/moviesDashboard/charts"
import { scaleTime, scaleSqrt } from "d3-scale"
import { extent } from "d3-array"

const MainContainer = styled(motion.div)`
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
  /* border: 1px solid black; */
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
  const { dataSets, activeNameID } = state

  useEffect(() => {
    favoritePersons &&
      favoritePersons.length &&
      actions.setActiveNameID(_.last(favoritePersons).id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // TODO: move it together with charts
  const [currState, setCurrState] = useState({
    id: undefined,
    mainType: undefined,
    isBoth: undefined,
    xScale: undefined,
    yScale: undefined,
  })
  useEffect(() => {
    if (
      dataSets.personCredits &&
      (!currState.id || currState.id !== dataSets.personCredits.id)
    ) {
      const isBoth =
        !!dataSets.personCredits.cast.length &&
        !!dataSets.personCredits.crew.length
      const data = [
        ...dataSets.personCredits.crew,
        ...dataSets.personCredits.cast,
      ].filter(d => !!d.release_date && !!d.vote_count)
      const xScale = scaleTime().domain(
        extent(data, d => new Date(d.release_date))
      )
      const sizeScale = scaleSqrt().domain(extent(data, d => d.vote_count)) // TODO: add it as optional
      const isActor = dataSets.personDetails.known_for_department === "Acting"
      setCurrState({
        id: dataSets.personCredits.id,
        mainType: isActor ? "cast" : "crew",
        subType: isBoth && isActor ? "crew" : "cast",
        isBoth,
        xScale,
        sizeScale,
      })
    }
  }, [dataSets, currState])

  const [yDomainSynced, setYDomainSynced] = useState(true)
  const [isSizeDynamic, setIsSizeDynamic] = useState(true)

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
                <PlaceHolderDiv>
                  <div onClick={() => setYDomainSynced(prev => !prev)}>
                    Y-domain
                  </div>
                  <div onClick={() => setIsSizeDynamic(prev => !prev)}>
                    Size
                  </div>
                </PlaceHolderDiv>
                {typeof currState.isBoth == "boolean" && (
                  <ChartContainer twoCharts={currState.isBoth}>
                    <BubbleChart
                      chart="main"
                      type={currState.mainType}
                      data={dataSets.personCredits[currState.mainType]}
                      {...currState}
                      yDomainSynced={yDomainSynced}
                      isSizeDynamic={isSizeDynamic}
                    />
                    <DateAxis
                      data={[
                        ...dataSets.personCredits.crew,
                        ...dataSets.personCredits.cast,
                      ]}
                      {...currState}
                    />
                    {currState.isBoth && (
                      <BubbleChart
                        chart="sub"
                        type={currState.subType}
                        data={dataSets.personCredits[currState.subType]}
                        {...currState}
                        yDomainSynced={yDomainSynced}
                        isSizeDynamic={isSizeDynamic}
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
