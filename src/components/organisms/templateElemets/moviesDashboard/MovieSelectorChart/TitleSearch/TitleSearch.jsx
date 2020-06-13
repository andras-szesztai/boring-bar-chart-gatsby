import React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import Select, { components } from "react-select"
import _ from "lodash"
import { IoIosArrowDown, IoIosClose, IoIosSearch } from "react-icons/io"

import { space, fontFamily } from "../../../../../../themes/theme"
import {
  WHILE_HOVER,
  COLORS,
  NO_ACTIVE_MOVIE,
} from "../../../../../../constants/moviesDashboard"
import { usePrevious } from "../../../../../../hooks"

const MovieSearchContainer = styled.div`
  width: 280px;

  display: flex;
  flex-direction: column;
  margin-right: ${space[6]}px;
  z-index: 6;
`

// TODO: setup to stay open on select
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
  React.useEffect(() => {
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
    color: COLORS.secondaryDark,
    "& input": {
      font: "inherit",
    },
  }),
  placeholder: provided => ({
    ...provided,
    fontSize: 16,
    color: COLORS.secondaryDark,
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
  indicatorSeparator: provided => {
    return {
      ...provided,
      backgroundColor: COLORS.secondaryDark,
    }
  },
}

export default function TitleSearch({
  options,
  setHoveredMovie,
  xScale,
  activeMovie,
  setActiveMovie,
}) {
  function getXPosition(data) {
    return Number(
      +data.data.unified_year >=
        _.mean(xScale.domain().map(d => d.getFullYear()))
    )
  }

  return (
    <MovieSearchContainer>
      <Select
        isClearable
        isSearchable
        options={options}
        setHoveredMovie={d => {
          setHoveredMovie({
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
  )
}
