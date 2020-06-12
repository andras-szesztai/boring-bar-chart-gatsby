import React, { useState } from "react"
import { IoIosSearch, IoIosClose } from "react-icons/io"
import { AnimatePresence } from "framer-motion"

import { TRANSITION } from "../../../../../constants/moviesDashboard"
import { useDebouncedSearch } from "../../../../../hooks"

import {
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
  color,
  resultContent: ResultContent,
  placeholder,
  id,
  resultContentAccessors,
  topZ
}) {
  const { inputText, setInputText } = useDebouncedSearch(getResults, 1000)
  const [activeSearchResult, setActiveSearchResult] = useState(0)
  const [searchIsFocused, setSearchIsFocused] = useState(false)

  return (
    <SearchBarSubContainer
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      z={topZ}
    >
      <AnimatePresence>
        {results.length && (
          <SearchItemHover
            initial={{ opacity: 0 }}
            animate={{ y: 45 + activeSearchResult * 70, opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={TRANSITION.primary}
            color={color}
            z={topZ}
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
        z={topZ}
      >
        <IoIosSearch size={25} color="#FFF" />
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
        z={topZ}
        role="button"
      >
        <IoIosClose size={25} color="#FFF" />
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
        id={id}
        name={id}
        placeholder={placeholder}
        size="50"
        color={color}
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
          if (key === "ArrowUp") {
            if (activeSearchResult === 0) {
              setActiveSearchResult(results.length - 1)
            } else {
              setActiveSearchResult(prev => prev - 1)
            }
          }
          if (key === "ArrowDown") {
            if (activeSearchResult === results.length - 1) {
              setActiveSearchResult(0)
            } else {
              setActiveSearchResult(prev => prev + 1)
            }
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
            color={color}
            initial="enter"
            animate="animate"
            exit="exit"
            variants={variants}
          >
            {results.map((res, i) => (
              <ResultContent
                key={res.id}
                zIndex={Math.abs(i - 4)}
                data={res}
                accessors={resultContentAccessors}
                handleClick={() => {
                  handleResultSelect(res.id)
                  setResults([])
                  setInputText("")
                  setSearchIsFocused(false)
                  setActiveSearchResult(0)
                }}
                handleMouseOver={() => {
                  setActiveSearchResult(i)
                }}
              />
            ))}
          </ResultsContainer>
        )}
      </AnimatePresence>
    </SearchBarSubContainer>
  )
}
