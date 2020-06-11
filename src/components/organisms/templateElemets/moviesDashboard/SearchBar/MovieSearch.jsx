import React from "react"

import { COLORS } from "../../../../../constants/moviesDashboard"

import SearchBar from "./SearchBar"
import { SearchBarMainContainer } from "./styles"

export default function MovieSearch({ setActiveMovie, setHoveredMovie }) {
  const [results, setResults] = React.useState([])
  //getResults function

  return (
    <SearchBar
      key="person-search"
      // getResults={fetchNames}
      // handleResultSelect={id => setActiveMovie({ id })}
      // handleResultHover={setHoveredMovie} // TODO: setup inside searchbar
      results={results}
      setResults={setResults}
      color={COLORS.secondary}
      // resultContent={PersonResultContainerContent}
      placeholder="Search for a title"
    />
  )
}
