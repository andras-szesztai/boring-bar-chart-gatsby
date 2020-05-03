import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { IoIosSearch, IoIosClose } from "react-icons/io"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"

import { useDeviceType, usePrevious } from "../../hooks"
import { FlexContainer } from "../atoms"
import { useDebouncedSearch } from "../../hooks"
import { space, fontFamily } from "../../themes/theme"
import { themifyFontSize, themifyZIndex } from "../../themes/mixins"

const imageRoot = "https://image.tmdb.org/t/p/w500/"
const apiRoot = "https://api.themoviedb.org/3"

const searchColor = "#6a8caf"

const SearchBarMainContainer = styled(motion.div)`
  position: fixed;
  left: ${space[2]}px;
`

const SearchBarSubContainer = styled(motion.div)`
  position: relative;
  cursor: pointer;
`

const SearchIconContainer = styled(motion.div)`
  position: absolute;
  top: ${space[2]}px;
  left: ${space[2]}px;
  z-index: ${themifyZIndex("tooltip")};
`

const CloseIconContainer = styled(motion.div)`
  position: absolute;
  left: 270px;
  z-index: ${themifyZIndex("tooltip")};
`

const ResultsContainer = styled(motion.div)`
  position: absolute;
  z-index: -1;
  padding-top: 30px;
  top: 10px;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const ResultContainer = styled(motion.div)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-self: flex-start;

  align-self: start;
  width: calc(100% - 10px);
  height: 30px;
  background-color: #f0f0f0;
  margin: 5px;
  padding-left: 5px;
`

const SearchBar = styled(motion.input)`
  z-index: ${themifyZIndex("hoverOverlay")};
  width: 300px;
  height: 40px;
  border-radius: ${space[1]}px;
  outline: none;
  border: none;
  background: ${searchColor};
  color: ${chroma(searchColor).brighten(3)};
  border: 1px solid ${chroma(searchColor).darken()};
  font-family: ${fontFamily};
  font-size: ${themifyFontSize(2)};
  font-weight: 300;

  padding-bottom: 2px;

  &::placeholder {
    font-weight: 200;
    color: ${chroma(searchColor).brighten(2)};
    font-family: inherit;
  }
`

export default function MoviesDashboard() {
  const device = useDeviceType()
  const [nameSearchResults, setNameSearchResults] = React.useState([])
  const fetchNames = text => {
    if (text) {
      return axios
        .get(
          `${apiRoot}/search/person?api_key=${process.env.MDB_API_KEY}&language=en-US&query=${text}&page=1&include_adult=false`
        )
        .then(function(response) {
          setNameSearchResults(response.data.results.filter((el, i) => i < 5))
        })
    }
    return setNameSearchResults([])
  }
  const { inputText, setInputText } = useDebouncedSearch(fetchNames, 1000)
  const [activeSearchResult, setActiveSearchResult] = useState(0)
  const [activeNameID, setActiveNameID] = useState(undefined)
  const prevActiveNameID = usePrevious(activeNameID)
  const [personDetails, setPersonDetails] = useState(undefined)
  const [searchIsFocused, setSearchIsFocused] = useState(false)
  const [combinedCredits, setCombinedCredits] = useState(undefined)

  useEffect(() => {
    if (activeNameID && activeNameID !== prevActiveNameID) {
      axios
        .all([
          axios.get(
            `${apiRoot}/person/${activeNameID}?api_key=${process.env.MDB_API_KEY}&language=en-US`
          ),
          axios.get(
            `${apiRoot}/person/${activeNameID}/combined_credits?api_key=${process.env.MDB_API_KEY}&language=en-US`
          ),
        ])
        .then(
          axios.spread((details, credits) => {
            setPersonDetails(details.data)
            setCombinedCredits(credits.data)
          })
        )
    }
  })

  const searchContainerVariants = {
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

  const searchResultVariants = {
    enter: { y: "-100%", opacity: 0 },
    animate: {
      y: "0%",
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
      },
    },
    exit: {
      y: "-100%",
      opacity: -1,
    },
  }

  const getSearchResultProps = id => {
    return {
      variants: searchResultVariants,
      onClick: () => {
        setActiveNameID(id)
        setNameSearchResults([])
        setInputText("")
        setSearchIsFocused(false)
        setActiveSearchResult(0)
      },
    }
  }

  return (
    <div>
      <Helmet title="Dashboard under construction" />
      {device === "desktop" && (
        <FlexContainer
          marginTop={2}
          fullScreen
          direction="column"
          justify="flex-start"
        >
          <SearchBarMainContainer>
            <SearchBarSubContainer>
              <SearchIconContainer
                animate={{
                  y: searchIsFocused ? -40 : 0,
                  opacity: searchIsFocused ? 0 : 1,
                }}
                transition={{
                  type: "spring",
                  damping: 12,
                }}
              >
                <IoIosSearch
                  size={25}
                  color={chroma(searchColor).brighten(3)}
                />
              </SearchIconContainer>
              <CloseIconContainer
                animate={{
                  y: inputText.length ? 9 : -20,
                  opacity: inputText.length ? 1 : 0,
                }}
                initial={{
                  y: -20,
                  opacity: 0,
                }}
                whileHover={{ scale: 1.3 }}
                transition={{ type: "spring", damping: 12 }}
                onClick={() => {
                  setInputText("")
                  setNameSearchResults([])
                }}
                role="button"
              >
                <IoIosClose size={25} color={chroma(searchColor).brighten(3)} />
              </CloseIconContainer>
              <SearchBar
                animate={{
                  paddingLeft: searchIsFocused ? 10 : 40,
                }}
                initial={{
                  paddingLeft: 40,
                }}
                transition={{
                  type: "spring",
                  damping: 12,
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
                  if (
                    key === "Enter" &&
                    nameSearchResults[activeSearchResult]
                  ) {
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
                    variants={searchContainerVariants}
                  >
                    {nameSearchResults[0] && (
                      <ResultContainer
                        {...getSearchResultProps(nameSearchResults[0].id)}
                        style={{ zIndex: 4 }}
                      >
                        {nameSearchResults[0].name}
                      </ResultContainer>
                    )}
                    {nameSearchResults[1] && (
                      <ResultContainer
                        {...getSearchResultProps(nameSearchResults[1].id)}
                        style={{ zIndex: 3 }}
                      >
                        {nameSearchResults[1].name}
                      </ResultContainer>
                    )}
                    {nameSearchResults[2] && (
                      <ResultContainer
                        {...getSearchResultProps(nameSearchResults[2].id)}
                        style={{ zIndex: 2 }}
                      >
                        {nameSearchResults[2].name}
                      </ResultContainer>
                    )}
                  </ResultsContainer>
                )}
              </AnimatePresence>
            </SearchBarSubContainer>
          </SearchBarMainContainer>
          {personDetails && (
            <FlexContainer direction="column" marginTop={5} withBorder>
              <div>{personDetails.name}</div>
              <div>{personDetails.birthday}</div>
              {personDetails.profile_path ? (
                <img
                  style={{ height: 100 }}
                  src={`${imageRoot}${personDetails.profile_path}`}
                  alt={personDetails.name}
                />
              ) : (
                <div
                  style={{ height: 100, width: 66.6, backgroundColor: "#333" }}
                />
              )}
            </FlexContainer>
          )}
        </FlexContainer>
      )}
    </div>
  )
}
