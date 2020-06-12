import React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

import { COLORS } from "../../../../../constants/moviesDashboard"

import SearchBar from "./SearchBar"
import { SearchBarMainContainer } from "./styles"
import { useStateWithPrevious } from "../../../../../hooks"
import { space, dropShadow } from "../../../../../themes/theme"

const ResultContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: 35px 1fr;
  grid-template-rows: repeat(2, 50%);
  grid-template-areas:
    "photo name"
    "photo job";
  grid-column-gap: 1.5rem;

  align-self: start;
  width: calc(100% - 10px);
  height: 60px;
  border-radius: ${space[1]}px;
  background-color: #fff;
  filter: drop-shadow(${dropShadow.primary});
  margin: 5px;
  padding: 4px 6px;
`

function MovieResultContent({ data }) {
  console.log("MovieResultContent -> data", data)
  return <div>{data.title}</div>
}

export default function MovieSearch({
  setActiveMovie,
  setHoveredMovie,
  allMovies,
}) {
  const [results, setResults] = React.useState([])
  const [searchText, setSearchText, prevSearchText] = useStateWithPrevious("")
  const getResults = text => {
    setSearchText(text)
  }
  React.useEffect(() => {
    if (!!searchText && searchText !== prevSearchText) {
      const newResults = allMovies
        .filter(movie => movie.title.toLowerCase().includes(searchText))
        .slice(0, 5)
      setResults(newResults)
    }
  }, [allMovies, prevSearchText, searchText])

  return (
    <SearchBar
      key="person-search"
      getResults={getResults}
      id="movie-search"
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
