import React, { useState } from "react"
import axios from "axios"
import styled from "styled-components"
import { IoIosSearch, IoIosClose } from "react-icons/io"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"

import { HANDLE_SIZE, CARD_WIDTH, COLORS } from "../../../../../constants/moviesDashboard"

import { BubbleChart, DateAxis } from "../charts"
import useMovieSelectorChartReducer from "./reducer/chartReducer"
import { MainContainer, SubContainer, ChartContainer } from "./styles"
import { space, fontFamily } from "../../../../../themes/theme"
import { themifyZIndex, themifyFontSize } from "../../../../../themes/mixins"

const ControlsContainer = styled(motion.div)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`

const MovieSearchContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  margin-right: ${space[2]}px;
  z-index: 4;
`


const StyledSearchBar = styled(motion.input)`
  z-index: ${themifyZIndex("hoverOverlay")};
  width: 300px;
  height: 30px;
  border-radius: ${space[1]}px;
  background: ${COLORS.secondary};
  color: #fff;
  border: 1px solid ${chroma(COLORS.secondary).darken()};
  font-family: ${fontFamily};
  font-size: ${themifyFontSize(2)};
  font-weight: 300;
  outline: none;

  padding-bottom: 2px;

  &::placeholder {
    font-weight: 300;
    color: ${chroma(COLORS.primary).brighten(3)};
    font-family: inherit;
  }
`

export default function MovieSelectorChart({
  activeNameID,
  loading,
  dataSets,
  setActiveMovie,
  activeMovie,
}) {
  const { state, actions } = useMovieSelectorChartReducer({ dataSets })
  const [isFirstEntered, setIsFirstEntered] = React.useState(true)

  console.log("state", state.movieSearchData)
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
    isFirstEntered: isFirstEntered,
    setIsFirstEntered: setIsFirstEntered,
  })

  return (
    <>
      {activeNameID && !loading.personCredits && (
        <MainContainer>
          <SubContainer>
            <ControlsContainer>
              <MovieSearchContainer>
                <StyledSearchBar/>
              </MovieSearchContainer>
              <div onClick={actions.setIsYDomainSynced}>Y-domain</div>
              <div onClick={actions.setIsSizeSynced}>Size</div>
            </ControlsContainer>
            {typeof state.isBoth == "boolean" && (
              <ChartContainer
                twoCharts={state.isBoth}
                onMouseLeave={() => setIsFirstEntered(true)}
              >
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
                  isFirstEntered={isFirstEntered}
                  setIsFirstEntered={setIsFirstEntered}
                />
                {state.isBoth && (
                  <BubbleChart {...makeProps("sub")} tooltipYPosition={1} />
                )}
              </ChartContainer>
            )}
          </SubContainer>
        </MainContainer>
      )}
    </>
  )
}
