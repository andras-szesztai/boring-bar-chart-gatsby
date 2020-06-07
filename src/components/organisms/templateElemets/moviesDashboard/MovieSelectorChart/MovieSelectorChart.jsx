import React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import Select, { components } from "react-select"
import _ from "lodash"

import {
  HANDLE_SIZE,
  WHILE_HOVER,
  COLORS,
  NO_ACTIVE_MOVIE,
} from "../../../../../constants/moviesDashboard"

import { BubbleChart, DateAxis } from "../charts"
import useMovieSelectorChartReducer from "./reducer/chartReducer"
import { MainContainer, SubContainer, ChartContainer } from "./styles"
import { space } from "../../../../../themes/theme"
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDown,
  IoIosClose,
} from "react-icons/io"

const ControlsContainer = styled(motion.div)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`

const MovieSearchContainer = styled(motion.div)`
  width: 240px;

  display: flex;
  flex-direction: column;
  margin-right: ${space[2]}px;
  z-index: 4;
`

const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <motion.div style={{ marginTop: 2 }} whileHover={WHILE_HOVER}>
        <IoIosArrowDown size={18} color={COLORS.secondaryDark} />
      </motion.div>
    </components.DropdownIndicator>
  )
}

const ClearIndicator = props => {
  return (
    <components.ClearIndicator {...props}>
      <motion.div style={{ marginTop: 2 }} whileHover={WHILE_HOVER}>
        <IoIosClose size={22} color={COLORS.secondaryDark} />
      </motion.div>
    </components.ClearIndicator>
  )
}

const customStyles = {
  clearIndicator: provided => {
    return {
      ...provided,
      cursor: "pointer",
      padding: 0,
      paddingRight: 8,
    }
  },
  dropdownIndicator: provided => {
    return {
      ...provided,
      cursor: "pointer",
      padding: 0,
      paddingLeft: 8,
      paddingRight: 8,
    }
  },
}

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
              <MovieSearchContainer>
                <Select
                  placeholder="Select or search a title..."
                  isClearable
                  isSearchable
                  test="test"
                  options={state.movieSearchData}
                  styles={customStyles}
                  components={{ DropdownIndicator, ClearIndicator }}
                  onChange={element => {
                    element
                      ? setActiveMovie({
                          id: element.value,
                          data: element.data,
                          position: Number(
                            +element.data.release_date.slice(0, 4) >=
                              _.mean(
                                state.scales.xScale
                                  .domain()
                                  .map(d => d.getFullYear())
                              )
                          ),
                        })
                      : setActiveMovie(NO_ACTIVE_MOVIE)
                  }}
                />
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
