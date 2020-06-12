import React, { useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import chroma from "chroma-js"

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
import { FavoriteStar } from "../../../../molecules"

const ControlsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, max-content);
  grid-column-gap: ${space[6]}px;
  align-items: end;
`

const TextContainer = styled(motion.div)`
  width: 550px;
  font-size: ${themifyFontSize(2)};
  color: ${COLORS.textColor};
  margin-bottom: ${space[3]}px;
  line-height: 1.65;
`

const ColoredSpan = styled.span`
  padding: 0px ${space[2]}px 2px ${space[2]}px;
  background-color: ${({ color }) => color};
  border: 1px solid ${({ color }) => chroma(color).darken()};
  border-radius: 2px;
  color: #fff;
`

const Link = styled(motion.a)`
  padding: 0px ${space[2]}px 2px ${space[2]}px;
  background-color: #1da1f2;
  border: 1px solid ${chroma("#1DA1F2").darken()};
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
            <ColoredSpan color={COLORS.primary}>search bar</ColoredSpan> in the
            top left corner. When selecting a person from the results, you will
            see this middle part getting populated and you can start exploring
            the data by hovering over the elements and by just clicking around!
          </TextContainer>
          <TextContainer>
            The dashboard allows you also to mark persons and movies/series as
            your favorites{" "}
            <span style={{ position: "relative" }}>
              ‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎
              <span style={{ position: "absolute", top: -4, right: -8 }}>
                <FavoriteStar isFavorited={true} width={30} />
              </span>
            </span>{" "}
            , which can help you with quick search options whenever you come
            back next time!
          </TextContainer>
          <TextContainer>
            Please keep in mind that this dashboard is a constant work in
            progress, and it will experience some changes in the near future by
            receiving some cool new features and getting some issues fixed. If
            you feel like share an idea about what type of features you would
            like to be added or any feedback about potential issues, please feel
            free to contact me anytime via <Link>twitter</Link>. Thank you so
            much and please enjoy your time exploring!
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
