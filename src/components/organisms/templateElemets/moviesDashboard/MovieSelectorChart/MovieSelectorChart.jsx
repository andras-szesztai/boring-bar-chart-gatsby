import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import Select, { components } from "react-select"
import _ from "lodash"
import Switch from "react-switch"

import {
  HANDLE_SIZE,
  WHILE_HOVER,
  COLORS,
  NO_ACTIVE_MOVIE,
} from "../../../../../constants/moviesDashboard"

import { BubbleChart, DateAxis } from "../charts"
import useMovieSelectorChartReducer from "./reducer/chartReducer"
import { MainContainer, SubContainer, ChartContainer } from "./styles"
import { space, fontFamily } from "../../../../../themes/theme"
import { IoIosArrowDown, IoIosClose, IoIosSearch } from "react-icons/io"
import { usePrevious } from "../../../../../hooks"
import { themifyFontSize } from "../../../../../themes/mixins"

const ControlsContainer = styled(motion.div)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`

const MovieSearchContainer = styled.div`
  width: 280px;

  display: flex;
  flex-direction: column;
  margin-right: ${space[6]}px;
  z-index: 6;
`

const CheckBoxContainer = styled.div`
  margin-right: ${space[6]}px;
  display: flex;
  align-items: flex-end;
  height: 32px;

  div {
    font-size: ${themifyFontSize(2)};
    color: ${COLORS.textColor};
    margin-right: ${space[2]}px;
  }

  cursor: pointer;
`

const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <motion.div style={{ marginTop: 4 }} whileHover={WHILE_HOVER}>
        <IoIosArrowDown size={18} color={COLORS.secondaryDark} />
      </motion.div>
    </components.DropdownIndicator>
  )
}

const ClearIndicator = props => {
  return (
    <components.ClearIndicator {...props}>
      <motion.div style={{ marginTop: 4 }} whileHover={WHILE_HOVER}>
        <IoIosClose size={22} color={COLORS.secondaryDark} />
      </motion.div>
    </components.ClearIndicator>
  )
}

const Option = props => {
  const prevProps = usePrevious(props)
  useEffect(() => {
    if (prevProps && !!props.isFocused && !prevProps.isFocused) {
      _.isFunction(props.selectProps.setHoveredMovie) &&
        props.selectProps.setHoveredMovie(props.data)
    }
  }, [prevProps, props])
  return <components.Option {...props} />
}

const Placeholder = props => {
  return (
    <components.Placeholder {...props}>
      <div style={{ display: "flex" }}>
        <motion.div style={{ marginTop: 6 }} whileHover={WHILE_HOVER}>
          <IoIosSearch size={20} color={COLORS.secondaryDark} />{" "}
        </motion.div>
        <div style={{ marginTop: 4, marginLeft: 8 }}>Search for a title</div>
      </div>
    </components.Placeholder>
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
  input: () => ({
    fontFamily: fontFamily,
    fontSize: 16,
    color: COLORS.textColor,
    "& input": {
      font: "inherit",
    },
  }),
  placeholder: provided => ({
    ...provided,
    fontSize: 16,
    color: COLORS.textColor,
    fontWeight: 300,
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: 12,
    cursor: state.isSelected ? "auto" : "pointer",
    backgroundColor: state.isSelected
      ? COLORS.secondaryDark
      : state.isFocused
      ? COLORS.secondaryLight
      : "#fff",
    color: state.isSelected ? "#fff" : COLORS.textColor,
    ":active": {
      backgroundColor: COLORS.secondaryLight,
    },
  }),
  singleValue: provided => ({
    ...provided,
    fontSize: 16,
  }),
  valueContainer: provided => {
    return {
      ...provided,
    }
  },
  control: (provided, state) => {
    return {
      ...provided,
      borderColor: COLORS.secondaryDark,
      boxShadow: "none",
      cursor: "pointer",
      "&:hover": {
        borderColor: COLORS.secondaryDark,
      },
    }
  },
  indicatorSeparator: (provided, state) => {
    return {
      ...provided,
      backgroundColor: COLORS.secondaryDark,
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

  function getXPosition(data) {
    return Number(
      +data.data.release_date.slice(0, 4) >=
        _.mean(state.scales.xScale.domain().map(d => d.getFullYear()))
    )
  }

  return (
    <>
      {activeNameID && !loading.personCredits && (
        <MainContainer>
          <SubContainer>
            <ControlsContainer>
              <MovieSearchContainer>
                <Select
                  isClearable
                  isSearchable
                  test="test"
                  options={state.movieSearchData}
                  setHoveredMovie={d => {
                    actions.setHoveredMovie({
                      id: d.value,
                      data: d.data,
                      yPosition: 1,
                      xPosition: getXPosition(d),
                    })
                  }}
                  styles={customStyles}
                  components={{
                    DropdownIndicator,
                    ClearIndicator,
                    Placeholder,
                    Option,
                  }}
                  value={
                    activeMovie.id && {
                      value: activeMovie.id,
                      label: activeMovie.data.title,
                    }
                  }
                  onChange={el => {
                    el
                      ? setActiveMovie({
                          id: el.value,
                          data: el.data,
                          position: getXPosition(el),
                        })
                      : setActiveMovie(NO_ACTIVE_MOVIE)
                  }}
                />
              </MovieSearchContainer>
              <CheckBoxContainer>
                <div
                  onClick={() => actions.setIsYDomainSynced(false)}
                  role="button"
                >
                  Dynamic
                </div>
                <Switch
                  checked={state.isYDomainSynced}
                  onChange={() =>
                    actions.setIsYDomainSynced(!state.isYDomainSynced)
                  }
                  uncheckedIcon={false}
                  checkedIcon={false}
                  width={40}
                  height={20}
                  onColor={COLORS.textColor}
                  offColor={COLORS.textColor}
                />
                <div
                  onClick={() => actions.setIsYDomainSynced(true)}
                  role="button"
                >
                  Fixed score axis
                </div>
              </CheckBoxContainer>
              <CheckBoxContainer>
                <div
                  onClick={() => actions.setIsSizeSynced(false)}
                  role="button"
                >
                  Dynamic
                </div>
                <Switch
                  checked={state.isSizeDynamic}
                  onChange={() => actions.setIsSizeSynced(!state.isSizeDynamic)}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  width={40}
                  height={20}
                  onColor={COLORS.textColor}
                  offColor={COLORS.textColor}
                />
                <div
                  onClick={() => actions.setIsSizeSynced(true)}
                  role="button"
                >
                  Fixed dot size
                </div>
              </CheckBoxContainer>
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
