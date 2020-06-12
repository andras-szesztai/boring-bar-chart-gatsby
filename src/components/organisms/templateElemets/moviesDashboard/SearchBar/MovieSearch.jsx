import React from "react"
import mean from "lodash/mean"
import isEqual from "lodash/isEqual"
import omit from "lodash/omit"

import {
  COLORS,
  NO_HOVERED_MOVIE,
} from "../../../../../constants/moviesDashboard"
import { useStateWithPrevious } from "../../../../../hooks"

import SearchBar from "./SearchBar"
import ResultContainerContent from "../ResultContainerContent/ResultContainerContent"

export default function MovieSearch({
  setActiveMovie,
  setHoveredMovie,
  allMovies,
  xScale,
  mainData,
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
    if (!searchText && prevSearchText) {
      setHoveredMovie(NO_HOVERED_MOVIE)
    }
  }, [allMovies, prevSearchText, searchText, setHoveredMovie])

  const getXPosition = year =>
    Number(+year >= mean(xScale.domain().map(el => el.getFullYear())))

  return (
    <SearchBar
      key="person-search"
      getResults={getResults}
      id="movie-search"
      handleResultSelect={id => {
        const data = allMovies.find(movie => movie.id === id).data
        setActiveMovie({
          id,
          data: data,
          position: getXPosition(data.release_year),
        })
      }}
      handleResultHover={res => {
        const data = omit(res, "release_year")
        setHoveredMovie({
          id: res.id,
          data,
          yPosition: !!mainData.find(mD => isEqual(data, mD)) ? 0 : 1,
          xPosition: getXPosition(res.release_year),
        })
      }}
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
