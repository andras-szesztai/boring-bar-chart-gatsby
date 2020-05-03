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

const ResultContainer = styled(motion.div)`
  display: flex;
`

const ResultsContainer = styled(motion.div)`
  position: absolute;
  z-index: -1;
  padding-top: 30px;
  top: 10px;
  width: 100%;
  border-radius: ${space[1]}px;
  background-color: ${chroma(searchColor).brighten(3)};
  border: 1px solid ${chroma(searchColor).darken()};
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
    enter: {
      height: 0,
      opacity: 0,
    },
    animate: {
      height: "auto",
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 1,
      },
    },
    exit: {
      height: 0,
      opacity: 0,
    },
  }

  const searchResultVariants = {
    enter: { opacity: 0 },
    animate: { opacity: 1 },
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
                  y: searchIsFocused ? 40 : 0,
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
                    transition={{
                      type: "spring",
                      damping: 12,
                    }}
                  >
                    {nameSearchResults.map(({ name, profile_path }, i) => (
                      <ResultContainer
                        key={name}
                        variants={searchResultVariants}
                        initial="enter"
                        animate="animate"
                        onMouseOver={() => setActiveSearchResult(i)}
                        onClick={() => {
                          setActiveNameID(
                            nameSearchResults[activeSearchResult].id
                          )
                          setNameSearchResults([])
                          setSearchIsFocused(false)
                          setInputText("")
                          setActiveSearchResult(0)
                        }}
                      >
                        {profile_path ? (
                          <img
                            style={{ height: 50 }}
                            src={`${imageRoot}${profile_path}`}
                            alt={name}
                          />
                        ) : (
                          <div
                            style={{
                              height: 50,
                              width: 33.3,
                              backgroundColor: "#333",
                            }}
                          />
                        )}
                        {name}
                      </ResultContainer>
                    ))}
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
