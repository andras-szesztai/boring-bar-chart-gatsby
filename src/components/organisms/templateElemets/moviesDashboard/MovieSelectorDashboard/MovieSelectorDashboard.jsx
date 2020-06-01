import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { scaleTime, scaleSqrt } from "d3-scale"
import { extent } from "d3-array"

import { BubbleChart, DateAxis } from "../charts"

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

export default function MovieSelectorDashboard({
  activeNameID,
  loading,
  dataSets,
  setActiveMovie,
  activeMovie,
}) {
  
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
      const sizeScale = scaleSqrt().domain(extent(data, d => d.vote_count))
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
      {activeNameID && !loading.personCredits && (
        <MainContainer>
          <SubContainer>
            <PlaceHolderDiv>
              <div onClick={() => setYDomainSynced(prev => !prev)}>
                Y-domain
              </div>
              <div onClick={() => setIsSizeDynamic(prev => !prev)}>Size</div>
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
                  setActiveMovie={setActiveMovie}
                  activeMovie={activeMovie}
                />
                <DateAxis
                  crewData={dataSets.personCredits.crew}
                  castData={dataSets.personCredits.cast}
                  type={currState.mainType}
                  {...currState}
                  setActiveMovie={setActiveMovie}
                  activeMovie={activeMovie}
                />
                {currState.isBoth && (
                  <BubbleChart
                    chart="sub"
                    type={currState.subType}
                    data={dataSets.personCredits[currState.subType]}
                    {...currState}
                    yDomainSynced={yDomainSynced}
                    isSizeDynamic={isSizeDynamic}
                    setActiveMovie={setActiveMovie}
                    activeMovie={activeMovie}
                  />
                )}
              </ChartContainer>
            )}
          </SubContainer>
        </MainContainer>
      )}
    </>
  )
}
