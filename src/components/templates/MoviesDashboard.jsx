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
import { space, fontFamily, dropShadow } from "../../themes/theme"
import { themifyFontSize, themifyZIndex } from "../../themes/mixins"
import { API_ROOT, IMAGE_ROOT, COLORS } from "../../constants/moviesDashboard"

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

const ResultContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-template-rows: repeat(2, 1fr);
  grid-template-areas:
    "photo name"
    "photo job";
  grid-column-gap: 1rem;

  align-self: start;
  width: calc(100% - 10px);
  height: 60px;
  border-radius: ${space[1]}px;
  background-color: #fff;
  filter: drop-shadow(${dropShadow.primary});
  margin: 5px;
  padding: 4px 6px;
`

const ImageContainer = styled.img`
  height: 100%;
  grid-area: photo;
  border-radius: 2px;
`

const NameContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: ${themifyFontSize(2)};
  font-weight: 500;
  color: ${COLORS.primary};
  grid-area: name;
`

const JobContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: ${themifyFontSize(1)};
  font-weight: 200;
  grid-area: job;
`

const SearchBar = styled(motion.input)`
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
    font-weight: 200;
    color: ${chroma(COLORS.primary).brighten(2)};
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
          `${API_ROOT}/search/person?api_key=${process.env.MDB_API_KEY}&language=en-US&query=${text}&page=1&include_adult=false`
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
            `${API_ROOT}/person/${activeNameID}?api_key=${process.env.MDB_API_KEY}&language=en-US`
          ),
          axios.get(
            `${API_ROOT}/person/${activeNameID}/combined_credits?api_key=${process.env.MDB_API_KEY}&language=en-US`
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
      transition: {
        type: "spring",
        damping: 12,
      },
    },
  }

  const getSearchResultProps = index => {
    return {
      variants: searchResultVariants,
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

  const ResultContainerContent = props => (
    <>
      {nameSearchResults[props.index].profile_path ? (
        <ImageContainer
          src={`${IMAGE_ROOT}/${nameSearchResults[props.index].profile_path}`}
          alt={nameSearchResults[props.index].name}
        />
      ) : (
        <div
          style={{
            gridArea: "photo",
            background: "#f2f2f2",
            // placeSelf: "stretch",
            width: 35,
            height: 52,
            borderRadius: 2,
          }}
        />
      )}
      <NameContainer>{nameSearchResults[props.index].name}</NameContainer>
      <JobContainer>
        Known for: {nameSearchResults[props.index].known_for_department}
      </JobContainer>
    </>
  )

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
              <AnimatePresence>
                {nameSearchResults.length && (
                  <SearchItemHover
                    animate={{ y: 45 + activeSearchResult * 70, opacity: 0.15 }}
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "spring",
                      damping: 12,
                    }}
                  />
                )}
              </AnimatePresence>
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
                  color={chroma(COLORS.primary).brighten(3)}
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
                <IoIosClose size={25} color={chroma(COLORS.primary).brighten(3)} />
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
                        {...getSearchResultProps(0)}
                        style={{ zIndex: 4 }}
                      >
                        <ResultContainerContent index={0} />
                      </ResultContainer>
                    )}
                    {nameSearchResults[1] && (
                      <ResultContainer
                        {...getSearchResultProps(1)}
                        style={{ zIndex: 3 }}
                      >
                        <ResultContainerContent index={1} />
                      </ResultContainer>
                    )}
                    {nameSearchResults[2] && (
                      <ResultContainer
                        {...getSearchResultProps(2)}
                        style={{ zIndex: 2 }}
                      >
                        <ResultContainerContent index={2} />
                      </ResultContainer>
                    )}
                    {nameSearchResults[3] && (
                      <ResultContainer
                        {...getSearchResultProps(3)}
                        style={{ zIndex: 1 }}
                      >
                        <ResultContainerContent index={3} />
                      </ResultContainer>
                    )}
                    {nameSearchResults[4] && (
                      <ResultContainer
                        {...getSearchResultProps(4)}
                        style={{ zIndex: 0 }}
                      >
                        <ResultContainerContent index={4} />
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
                  src={`${IMAGE_ROOT}/${personDetails.profile_path}`}
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
