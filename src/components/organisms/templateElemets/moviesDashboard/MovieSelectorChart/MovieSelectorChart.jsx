import React from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"

import { BubbleChart, DateAxis } from "../charts"
import Switch from "../Switch/Switch"

import useMovieSelectorChartReducer from "./reducer/chartReducer"
import { MainContainer, SubContainer, ChartContainer } from "./styles"
import { MovieSearch } from "../SearchBar"
import { space } from "../../../../../themes/theme"
import IntroText from "./IntroText/IntroText"
import {
  OPACITY_VARIANT,
  ANIMATE_PROPS,
} from "../../../../../constants/moviesDashboard"

const ControlsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, max-content);
  grid-column-gap: ${space[6]}px;
  align-items: end;
`

export default function MovieSelectorChart({
  activeNameID,
  loading,
  dataSets,
  setActiveMovie,
  activeMovie,
  favoriteMovies,
}) {
  const { state, actions } = useMovieSelectorChartReducer({ dataSets })
  const [isFirstEntered, setIsFirstEntered] = React.useState(true)

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
    favoriteMovies,
  })

  return (
    <>
      <AnimatePresence>
        {!activeNameID && (
          <MainContainer variants={OPACITY_VARIANT} {...ANIMATE_PROPS}>
            <IntroText />
          </MainContainer>
        )}
      </AnimatePresence>
      {activeNameID && !loading.personCredits && (
        <MainContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5 } }}
        >
          <SubContainer>
            <ControlsContainer>
              <MovieSearch
                setActiveMovie={setActiveMovie}
                setHoveredMovie={actions.setHoveredMovie}
                allMovies={state.movieSearchData}
                xScale={state.scales.xScale}
                isBoth={state.isBoth}
                mainData={
                  state.types.main &&
                  (dataSets.personCredits[state.types.main] || [])
                }
              />
              <Switch
                handleAction={actions.setIsYDomainSynced}
                value={state.isYDomainSynced}
                onText="Fixed score axis"
              />
              <Switch
                handleAction={actions.setIsSizeSynced}
                value={state.isSizeDynamic}
                onText="Dynamic dot size based on the number of votes"
              />
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
                  subData={
                    state.isBoth
                      ? dataSets.personCredits[state.types.sub] || []
                      : []
                  }
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
