import React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

import { BubbleChart, DateAxis } from "../charts"
import useMovieSelectorChartReducer from "./reducer/chartReducer"

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

export default function MovieSelectorChart({
  activeNameID,
  loading,
  dataSets,
  setActiveMovie,
  activeMovie,
}) {
  const { chartState, actions } = useMovieSelectorChartReducer({ dataSets })

  return (
    <>
      {activeNameID && !loading.personCredits && (
        <MainContainer>
          <SubContainer>
            <PlaceHolderDiv>
              <div onClick={actions.setIsYDomainSynced}>Y-domain</div>
              <div onClick={actions.setIsSizeSynced}>Size</div>
            </PlaceHolderDiv>
            {typeof chartState.isBoth == "boolean" && (
              <ChartContainer twoCharts={chartState.isBoth}>
                <BubbleChart
                  chart="main"
                  type={chartState.types.main}
                  data={dataSets.personCredits[chartState.types.main]}
                  xScale={chartState.scales.xScale}
                  sizeScale={chartState.scales.sizeScale}
                  isYDomainSynced={chartState.isYDomainSynced}
                  isSizeDynamic={chartState.isSizeDynamic}
                  setActiveMovie={setActiveMovie}
                  activeMovie={activeMovie}
                />
                <DateAxis
                  crewData={dataSets.personCredits.crew}
                  castData={dataSets.personCredits.cast}
                  type={chartState.types.main}
                  xScale={chartState.scales.xScale}
                  setActiveMovie={setActiveMovie}
                  activeMovie={activeMovie}
                />
                {chartState.isBoth && (
                  <BubbleChart
                    chart="sub"
                    type={chartState.types.sub}
                    data={dataSets.personCredits[chartState.types.sub]}
                    xScale={chartState.scales.xScale}
                    sizeScale={chartState.scales.sizeScale}
                    isYDomainSynced={chartState.isYDomainSynced}
                    isSizeDynamic={chartState.isSizeDynamic}
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
