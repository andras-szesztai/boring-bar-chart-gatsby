import React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

import { HANDLE_SIZE } from "../../../../../constants/moviesDashboard"

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
  width: calc(100% - (2 * ${HANDLE_SIZE}px));
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
`

export default function MovieSelectorChart({
  activeNameID,
  loading,
  dataSets,
  setActiveMovie,
  activeMovie,
}) {
  const { state, actions } = useMovieSelectorChartReducer({ dataSets })

  const makeProps = acc => ({
    chart: acc,
    type: state.types[acc],
    data: dataSets.personCredits[state.types[acc]],
    xScale: state.scales.xScale,
    sizeScale: state.scales.sizeScale,
    isYDomainSynced: state.isYDomainSynced,
    isSizeDynamic: state.isSizeDynamic,
    setActiveMovie: setActiveMovie,
    activeMovie: activeMovie,
    setHoveredMovie: actions.setHoveredMovie,
    hoveredMovie: state.hoveredMovie,
  })

  return (
    <>
      {activeNameID && !loading.personCredits && (
        <MainContainer>
          <SubContainer>
            <PlaceHolderDiv>
              <div onClick={actions.setIsYDomainSynced}>Y-domain</div>
              <div onClick={actions.setIsSizeSynced}>Size</div>
            </PlaceHolderDiv>
            {typeof state.isBoth == "boolean" && (
              <ChartContainer twoCharts={state.isBoth}>
                <BubbleChart
                  {...makeProps("main")}
                  tooltipYPosition={state.isBoth ? 0 : 1}
                />
                <DateAxis
                  mainData={dataSets.personCredits[state.types.main] || []}
                  subData={dataSets.personCredits[state.types.sub] || []}
                  type={state.types.main}
                  xScale={state.scales.xScale}
                  setActiveMovie={setActiveMovie}
                  activeMovie={activeMovie}
                  setHoveredMovie={actions.setHoveredMovie}
                  hoveredMovie={state.hoveredMovie}
                  isBoth={state.isBoth}
                />
                {state.isBoth && (
                  <BubbleChart
                    {...makeProps("sub")}
                    tooltipYPosition={1}
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
