import React from "react"
import axios from "axios"

import { API_ROOT, COLORS } from "../../../../../constants/moviesDashboard"

import ResultContainerContent from "../ResultContainerContent/ResultContainerContent"
import SearchBar from "./SearchBar"
import { SearchBarMainContainer } from "./styles"

export default function PersonSearch({ setActiveNameID }) {
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

  return (
    <SearchBarMainContainer z={11}>
      <SearchBar
        key="person-search"
        id="person-search"
        getResults={fetchNames}
        handleResultSelect={id => setActiveNameID({ id })}
        results={nameSearchResults}
        setResults={setNameSearchResults}
        color={COLORS.primary}
        resultContent={ResultContainerContent}
        resultContentAccessors={{
          img: "profile_path",
          imgAlt: "name",
          subText: "Known for",
          subTextValue: "known_for_department",
        }}
        placeholder="Search for a director, actor, screenwriter . . . "
        topZ={11}
      />
    </SearchBarMainContainer>
  )
}
