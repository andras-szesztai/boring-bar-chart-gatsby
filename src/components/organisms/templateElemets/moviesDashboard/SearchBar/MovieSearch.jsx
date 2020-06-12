import React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

import { COLORS } from "../../../../../constants/moviesDashboard"

import SearchBar from "./SearchBar"
import { SearchBarMainContainer } from "./styles"

const ResultContainer = styled(motion.div)``

function MovieResultContent(data) {
  return <div>{data.title}</div>
}

export default function MovieSearch({
  setActiveMovie,
  setHoveredMovie,
  allMovies,
}) {
  const [results, setResults] = React.useState([])
  const getResults = text => {
    console.log(allMovies)
    console.log(text)
  }

  return (
    <SearchBar
      key="person-search"
      getResults={getResults}
      // handleResultSelect={id => setActiveMovie({ id })}
      // handleResultHover={setHoveredMovie} // TODO: setup inside searchbar
      results={results}
      setResults={setResults}
      color={COLORS.secondaryDark}
      resultContent={MovieResultContent}
      placeholder="Search for a title"
    />
  )
}
