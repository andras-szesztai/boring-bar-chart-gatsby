import React, { useState } from "react"
import { IoIosSearch, IoIosClose } from "react-icons/io"
import { AnimatePresence } from "framer-motion"
import chroma from "chroma-js"

import {
  COLORS,
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

export default function SearchBar({
  getResults,
  handleResultSelect,
  results,
  setResults,
}) {
  const { inputText, setInputText } = useDebouncedSearch(getResults, 1000)
  const [activeSearchResult, setActiveSearchResult] = useState(0)
  const [searchIsFocused, setSearchIsFocused] = useState(false)

  const getSearchResultProps = index => {
    return {
      onClick: () => {
        handleResultSelect(results[index].id)
        setResults([])
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
          {results.length && (
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
          transition={TRANSITION.primary}
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
            setResults([])
          }}
          role="button"
        >
          <IoIosClose size={25} color={chroma(COLORS.primary).brighten(3)} />
        </CloseIconContainer>
        <StyledSearchBar
          animate={{
            paddingLeft: searchIsFocused ? 10 : 40,
          }}
          initial={{
            paddingLeft: 40,
          }}
          transition={TRANSITION.primary}
          type="text"
          id="search"
          name="name search"
          placeholder="Search for a film director, actor, writer . . . "
          size="50"
          autoComplete="off"
          onFocus={() => setSearchIsFocused(true)}
          onBlur={() => setSearchIsFocused(false)}
          onChange={(e, v) => {
            setResults([])
            setActiveSearchResult(0)
            setInputText(e.target.value)
            setSearchIsFocused(true)
          }}
          onKeyDown={({ key }) => {
            // TODO: add option to go last when top
            if (key === "ArrowDown" && activeSearchResult !== 4) {
              setActiveSearchResult(prev => prev + 1)
            }
            if (key === "ArrowUp" && activeSearchResult !== 0) {
              setActiveSearchResult(prev => prev - 1)
            }
            if (key === "Enter" && results[activeSearchResult]) {
              handleResultSelect(results[activeSearchResult].id)
              setResults([])
              setInputText("")
              setSearchIsFocused(false)
              setActiveSearchResult(0)
            }
          }}
          value={inputText}
        />
        <AnimatePresence>
          {results.length && (
            <ResultsContainer
              initial="enter"
              animate="animate"
              exit="exit"
              variants={variants}
            >
              {results[0] && (
                <ResultContainerContent
                  containerProps={getSearchResultProps(0)}
                  zIndex={4}
                  nameSearchResult={results[0]}
                />
              )}
              {results[1] && (
                <ResultContainerContent
                  containerProps={getSearchResultProps(1)}
                  zIndex={3}
                  nameSearchResult={results[1]}
                />
              )}
              {results[2] && (
                <ResultContainerContent
                  containerProps={getSearchResultProps(2)}
                  zIndex={2}
                  nameSearchResult={results[2]}
                />
              )}
              {results[3] && (
                <ResultContainerContent
                  containerProps={getSearchResultProps(3)}
                  zIndex={1}
                  nameSearchResult={results[3]}
                />
              )}
              {results[4] && (
                <ResultContainerContent
                  containerProps={getSearchResultProps(4)}
                  zIndex={0}
                  nameSearchResult={results[4]}
                />
              )}
            </ResultsContainer>
          )}
        </AnimatePresence>
      </SearchBarSubContainer>
    </SearchBarMainContainer>
  )
}
