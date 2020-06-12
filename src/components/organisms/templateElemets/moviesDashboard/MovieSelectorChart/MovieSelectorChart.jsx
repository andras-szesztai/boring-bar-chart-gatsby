import React, { useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

import { BubbleChart, DateAxis } from "../charts"
import Switch from "../Switch/Switch"

import useMovieSelectorChartReducer from "./reducer/chartReducer"
import { MainContainer, SubContainer, ChartContainer } from "./styles"
import { MovieSearch } from "../SearchBar"
import { space } from "../../../../../themes/theme"
import { themifyFontSize } from "../../../../../themes/mixins"
import {
  COLORS,
  LOCAL_STORE_ACCESSORS,
} from "../../../../../constants/moviesDashboard"
import { useLocalStorage } from "../../../../../hooks"

const ControlsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, max-content);
  grid-column-gap: ${space[6]}px;
  align-items: end;
`

const TextContainer = styled(motion.div)`
  width: 500px;
  font-size: ${themifyFontSize(2)};
  color: ${COLORS.textColor};
  margin-bottom: ${space[3]}px;
`

const ColoredSpan = styled.span`
  padding: ${space[1]}px  ${space[2]}px;;
  background-color: ${({ color }) => color};
  border-radius: 2px;
  color: #fff;
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

  const [isVisited, setIsVisited] = useLocalStorage(
    LOCAL_STORE_ACCESSORS.lockedPersonDetailCard,
    false
  )
  const startIsVisited = React.useRef(isVisited) // use to determine text
  useEffect(() => {
    if (!isVisited) {
      setIsVisited(true)
    }
  })

  //console.log(loading) might be animateable
  return (
    <MainContainer>
      {!activeNameID && (
        <>
          <TextContainer>
            Hi there, thank you so much for passing by! Please let me welcome
            you on your first visit of this dashboard!
          </TextContainer>
          <TextContainer>
            To quickly explain the idea behind it, allow me to ask you a
            question: have you ever wanted to more easily explore discover more
            about the filmography of some of your favorite actors, directors or
            screenwriters? If your answer is yes, the good news is that the
            following dashboard attempts to help you to do exactly that!
          </TextContainer>
          <TextContainer>
            You can take a start already by typing a name into the{" "}
            <ColoredSpan color={COLORS.primary}>search bar</ColoredSpan>
          </TextContainer>
        </>
      )}
      {activeNameID && !loading.personCredits && (
        <SubContainer>
          <ControlsContainer>
            <MovieSearch
              setActiveMovie={setActiveMovie}
              setHoveredMovie={actions.setHoveredMovie}
              allMovies={state.movieSearchData}
              xScale={state.scales.xScale}
              mainData={
                state.types.main &&
                (dataSets.personCredits[state.types.main] || [])
              }
            />
            <Switch
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
      )}
    </MainContainer>
  )
}
