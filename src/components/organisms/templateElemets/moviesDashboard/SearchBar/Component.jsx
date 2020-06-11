import React, { useState } from "react"
import axios from "axios"
import { IoIosSearch, IoIosClose } from "react-icons/io"
import { AnimatePresence } from "framer-motion"
import chroma from "chroma-js"

import {
  COLORS,
  API_ROOT,
  TRANSITION,
  CARD_WIDTH,
} from "../../../../../constants/moviesDashboard"
import { useDebouncedSearch } from "../../../../../hooks"
import ResultContainerContent from "../ResultContainerContent/ResultContainerContent"
import {
  SearchBarMainContainer,
  SearchBarSubContainer,
  SearchItemHover,
  SearchIconContainer,
  CloseIconContainer,
  ResultsContainer,
  variants,
  StyledSearchBar,
} from "./styles"

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
        setActiveNameID({ id: nameSearchResults[index].id })
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
            transition: TRANSITION.primary,
          }}
          whileHover={{ scale: 1.3 }}
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
            width: CARD_WIDTH - 50,
          }}
          initial={{
            paddingLeft: 40,
            width: 20,
          }}
          transition={{
            type: "spring",
            damping: 12,
          }}
          type="text"
          id="search"
          name="name search"
          placeholder="Search for a film director, actor, writer . . . "
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
              setActiveNameID({ id: nameSearchResults[activeSearchResult].id })
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
