import React, { useState } from "react"
import axios from "axios"
import styled from "styled-components"
import { IoIosSearch, IoIosClose } from "react-icons/io"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"

import { themifyZIndex, themifyFontSize } from "../../../../../themes/mixins"
import { space, fontFamily } from "../../../../../themes/theme"
import { COLORS, API_ROOT, TRANSITION } from "../../../../../constants/moviesDashboard"
import { useDebouncedSearch } from "../../../../../hooks"
import ResultContainerContent from "../ResultContainerContent/ResultContainerContent"

const SearchBarMainContainer = styled(motion.div)`
  position: fixed;
  left: ${space[2]}px;
  top: ${space[2]}px;
  z-index: 1;
`

const SearchBarSubContainer = styled(motion.div)`
  position: relative;
  cursor: pointer;
`

const StyledSearchBar = styled(motion.input)`
  z-index: ${themifyZIndex("hoverOverlay")};
  width: 300px;
  height: 40px;
  border-radius: ${space[1]}px;
  background: ${COLORS.primary};
  color: ${chroma(COLORS.primary).brighten(3)};
  border: 1px solid ${chroma(COLORS.primary).darken()};
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

const SearchIconContainer = styled(motion.div)`
  position: absolute;
  top: ${space[2]}px;
  left: ${space[2]}px;
  z-index: ${themifyZIndex("tooltip")};
`

const CloseIconContainer = styled(motion.div)`
  position: absolute;
  top: ${space[2]}px;
  right: 5px;
  z-index: ${themifyZIndex("tooltip")};
`

const SearchItemHover = styled(motion.div)`
  position: absolute;
  z-index: ${themifyZIndex("tooltip")};

  height: 70px;
  width: 100%;
  background-color: ${COLORS.primary};
  border: 1px solid ${chroma(COLORS.primary).darken(2)};
  border-radius: ${space[1]}px;
  pointer-events: none;
`

const ResultsContainer = styled(motion.div)`
  position: absolute;
  z-index: -1;
  padding-top: 35px;
  top: 10px;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const variants = {
  animate: {
    transition: {
      staggerChildren: 0.25,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.15,
      staggerDirection: -1,
    },
  },
}

export default function SearchBar({ setActiveNameID }) {
  const [nameSearchResults, setNameSearchResults] = React.useState([])
  const fetchNames = text => {
    if (text) {
      return axios
        .get(
          `${API_ROOT}/search/person?api_key=${process.env.MDB_API_KEY}&language=en-US&query=${text}&page=1&include_adult=false`
        )
        .then(function(response) {
          setNameSearchResults(response.data.results.filter((el, i) => i < 5))
        })
        .catch(function(error) {
          console.log(error)
        })
    }
    return setNameSearchResults([])
  }
  const { inputText, setInputText } = useDebouncedSearch(fetchNames, 1000)
  const [activeSearchResult, setActiveSearchResult] = useState(0)
  const [searchIsFocused, setSearchIsFocused] = useState(false)

  const getSearchResultProps = index => {
    return {
      onClick: () => {
        setActiveNameID(nameSearchResults[index].id)
        setNameSearchResults([])
        setInputText("")
        setSearchIsFocused(false)
        setActiveSearchResult(0)
      },
      onMouseOver: () => {
        setActiveSearchResult(index)
      },
    }
  }

  return (
    <SearchBarMainContainer
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
    >
      <SearchBarSubContainer>
        <AnimatePresence>
          {nameSearchResults.length && (
            <SearchItemHover
              initial={{ opacity: 0 }}
              animate={{ y: 45 + activeSearchResult * 70, opacity: 0.15 }}
              exit={{ opacity: 0 }}
              transition={TRANSITION.primary}
            />
          )}
        </AnimatePresence>
        <SearchIconContainer
          animate={{
            rotateY: searchIsFocused ? -80 : 0,
            x: searchIsFocused ? -10 : 0,
            opacity: searchIsFocused ? 0 : 1,
          }}
          transition={{
            type: "spring",
            damping: 12,
          }}
        >
          <IoIosSearch size={25} color={chroma(COLORS.primary).brighten(3)} />
        </SearchIconContainer>
        <CloseIconContainer
          initial={{
            opacity: 0,
          }}
          animate={{
            rotateY: inputText.length ? 0 : 80,
            x: inputText.length ? 0 : 10,
            opacity: inputText.length ? 1 : 0,
          }}
          whileHover={{ scale: 1.3 }}
          transition={{ type: "spring", damping: 12 }}
          onClick={() => {
            setInputText("")
            setNameSearchResults([])
          }}
          role="button"
        >
          <IoIosClose size={25} color={chroma(COLORS.primary).brighten(3)} />
        </CloseIconContainer>
        <StyledSearchBar
          animate={{
            paddingLeft: searchIsFocused ? 10 : 40,
            width: 300,
          }}
          initial={{
            paddingLeft: 40,
            width: 20,
          }}
          transition={{
            type: "spring",
            damping: 12
          }}
          type="text"
          id="search"
          name="name search"
          placeholder="Search a name"
          size="50"
          autoComplete="off"
          onFocus={() => setSearchIsFocused(true)}
          onBlur={() => setSearchIsFocused(false)}
          onChange={(e, v) => {
            setNameSearchResults([])
            setActiveSearchResult(0)
            setInputText(e.target.value)
            setSearchIsFocused(true)
          }}
          onKeyDown={({ key }) => {
            if (key === "ArrowDown" && activeSearchResult !== 4) {
              setActiveSearchResult(prev => prev + 1)
            }
            if (key === "ArrowUp" && activeSearchResult !== 0) {
              setActiveSearchResult(prev => prev - 1)
            }
            if (key === "Enter" && nameSearchResults[activeSearchResult]) {
              setActiveNameID(nameSearchResults[activeSearchResult].id)
              setNameSearchResults([])
              setInputText("")
              setSearchIsFocused(false)
              setActiveSearchResult(0)
            }
          }}
          value={inputText}
        />
        <AnimatePresence>
          {nameSearchResults.length && (
            <ResultsContainer
              initial="enter"
              animate="animate"
              exit="exit"
              variants={variants}
            >
              {nameSearchResults[0] && (
                <ResultContainerContent
                  index={0}
                  containerProps={getSearchResultProps(0)}
                  zIndex={4}
                  nameSearchResults={nameSearchResults}
                />
              )}
              {nameSearchResults[1] && (
                <ResultContainerContent
                  index={1}
                  containerProps={getSearchResultProps(1)}
                  zIndex={3}
                  nameSearchResults={nameSearchResults}
                />
              )}
              {nameSearchResults[2] && (
                <ResultContainerContent
                  index={2}
                  containerProps={getSearchResultProps(2)}
                  zIndex={2}
                  nameSearchResults={nameSearchResults}
                />
              )}
              {nameSearchResults[3] && (
                <ResultContainerContent
                  index={3}
                  containerProps={getSearchResultProps(3)}
                  zIndex={1}
                  nameSearchResults={nameSearchResults}
                />
              )}
              {nameSearchResults[4] && (
                <ResultContainerContent
                  index={4}
                  containerProps={getSearchResultProps(4)}
                  zIndex={0}
                  nameSearchResults={nameSearchResults}
                />
              )}
            </ResultsContainer>
          )}
        </AnimatePresence>
      </SearchBarSubContainer>
    </SearchBarMainContainer>
  )
}
