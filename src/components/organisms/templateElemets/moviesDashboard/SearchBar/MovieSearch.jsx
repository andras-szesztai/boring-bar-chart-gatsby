import React from "react"
import mean from "lodash/mean"

import { COLORS } from "../../../../../constants/moviesDashboard"
import { useStateWithPrevious } from "../../../../../hooks"

import SearchBar from "./SearchBar"
import ResultContainerContent from "../ResultContainerContent/ResultContainerContent"

export default function MovieSearch({
  setActiveMovie,
  setHoveredMovie,
  allMovies,
  xScale,
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

  const getXPosition = year =>  Number(+year >= mean(xScale.domain().map(el => el.getFullYear())))

  // Hovered:
  // id: undefined,
  // data: {},
  // yPosition: undefined,
  // xPosition: undefined,

  return (
    <SearchBar
      key="person-search"
      getResults={getResults}
      id="movie-search"
      handleResultSelect={id => {
        const data = allMovies.find(movie => movie.id === id).data
        const meanYear = 
        setActiveMovie({
          id,
          data: data,
          position: getXPosition(data.release_year)
        })
      }}
      // handleResultHover={setHoveredMovie} // TODO: setup inside searchbar
      results={results.map(d => d.data)}
      setResults={setResults}
      color={COLORS.secondaryDark}
      resultContent={ResultContainerContent}
      resultContentAccessors={{
        img: "poster_path",
        imgAlt: "title",
        subText: "Release year",
        subTextValue: "release_year",
      }}
      placeholder="Search for a title"
      topZ={8}
    />
  )
}
