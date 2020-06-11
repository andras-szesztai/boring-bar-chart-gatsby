import React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

import Switch from "../Switch/Switch"
import TitleSearch from "./TitleSearch/TitleSearch"
import { BubbleChart, DateAxis } from "../charts"

import useMovieSelectorChartReducer from "./reducer/chartReducer"
import { MainContainer, SubContainer, ChartContainer } from "./styles"
import SearchBar from "../SearchBar/SearchBar"
import { COLORS } from "../../../../../constants/moviesDashboard"

const ControlsContainer = styled(motion.div)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
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
              <SearchBar
                key="movie-search"
                // getResults={fetchNames}
                // handleResultSelect={id => setActiveNameID({ id })}
                results={[]}
                // setResults={setNameSearchResults}
                color={COLORS.secondary}
                // resultContent={PersonResultContainerContent}
                placeholder="Search for a title"
              />
              {/* <TitleSearch
                options={state.movieSearchData}
                setHoveredMovie={actions.setHoveredMovie}
                xScale={state.scales.xScale}
                activeMovie={activeMovie}
                setActiveMovie={setActiveMovie}
              /> */}
              {/* <Switch
                handleAction={actions.setIsYDomainSynced}
                value={state.isYDomainSynced}
                offText="Dynamic"
                onText="Fixed score axis"
              />
              <Switch
                handleAction={actions.setIsSizeSynced}
                value={state.isSizeDynamic}
                offText="Fixed"
                onText="Dynamic dot size"
              /> */}
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
