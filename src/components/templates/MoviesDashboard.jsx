import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"

import { useDeviceType, usePrevious } from "../../hooks"
import { FlexContainer } from "../atoms"
import { useDebouncedSearch } from "../../hooks"

const imageRoot = "https://image.tmdb.org/t/p/w500/"

export default function MoviesDashboard() {
  const device = useDeviceType()
  const { inputText, setInputText } = useDebouncedSearch(fetchNames, 1000)
  const [nameSearchResults, setNameSearchResults] = React.useState([])
  const fetchNames = text => {
    if (text) {
      return axios
        .get(
          `https://api.themoviedb.org/3/search/person?api_key=${process.env.MDB_API_KEY}&language=en-US&query=${text}&page=1&include_adult=false`
        )
        .then(function(response) {
          setNameSearchResults(response.data.results)
        })
    }
    return setNameSearchResults([])
  }
  const [activeSearchResult, setActiveSearchResult] = useState(0)
  const [ activeNameID, setActiveNameID ] = useState(undefined)
  const prevActiveNameID = usePrevious(activeNameID)

  useEffect(() => {
    if(activeNameID && activeNameID !== prevActiveNameID){
      console.log(activeNameID)
    }
  })


  return (
    <>
      <Helmet title="Dashboard under construction" />
      {device === "desktop" && (
        <FlexContainer
          marginTop={2}
          fullScreen
          direction="column"
          justify="flex-start"
        >
          <input
            type="text"
            id="search"
            name="name search"
            size="50"
            onChange={(e, v) => {
              setNameSearchResults([])
              setActiveSearchResult(0)
              setInputText(e.target.value)
            }}
            onKeyDown={({ key }) => {
              if (key === "ArrowDown" && activeSearchResult !== 4) {
                setActiveSearchResult(prev => prev + 1)
              }
              if (key === "ArrowUp" && activeSearchResult !== 0) {
                setActiveSearchResult(prev => prev - 1)
              }
              if (key === "Enter" && nameSearchResults[activeSearchResult]) {
                setActiveNameID(nameSearchResults[activeSearchResult].id)
              }
            }}
            value={inputText}
          />
          {nameSearchResults
            .filter((el, i) => i < 5)
            .map(({ name }, i) => (
              <FlexContainer
                cursor="pointer"
                withBorder={activeSearchResult === i}
              >
                {name}
              </FlexContainer>
            ))}
        </FlexContainer>
      )}
    </>
  )
}
