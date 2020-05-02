import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"

import { useDeviceType, usePrevious } from "../../hooks"
import { FlexContainer } from "../atoms"
import { useDebouncedSearch } from "../../hooks"

const imageRoot = "https://image.tmdb.org/t/p/w500/"
const apiRoot = "https://api.themoviedb.org/3"

export default function MoviesDashboard() {
  const device = useDeviceType()
  const [nameSearchResults, setNameSearchResults] = React.useState([])
  const fetchNames = text => {
    if (text) {
      return axios
        .get(
          `${apiRoot}/search/person?api_key=${process.env.MDB_API_KEY}&language=en-US&query=${text}&page=1&include_adult=false`
        )
        .then(function(response) {
          setNameSearchResults(response.data.results)
        })
    }
    return setNameSearchResults([])
  }
  const { inputText, setInputText } = useDebouncedSearch(fetchNames, 1000)
  const [activeSearchResult, setActiveSearchResult] = useState(0)
  const [activeNameID, setActiveNameID] = useState(undefined)
  const prevActiveNameID = usePrevious(activeNameID)
  const [personDetails, setPersonDetails] = useState(undefined)
  const [searchIsFocused, setSearchIsFocused] = useState(false)
  const [combinedCredits, setCombinedCredits] = useState(undefined)

  useEffect(() => {
    if (activeNameID && activeNameID !== prevActiveNameID) {
      axios
        .all([
          axios.get(
            `${apiRoot}/person/${activeNameID}?api_key=${process.env.MDB_API_KEY}&language=en-US`
          ),
          axios.get(
            `${apiRoot}/person/${activeNameID}/combined_credits?api_key=${process.env.MDB_API_KEY}&language=en-US`
          ),
        ])
        .then(
          axios.spread((details, credits) => {
            setPersonDetails(details)
            setCombinedCredits(credits)
          })
        )
    }
  })

  return (
    <div>
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
                setActiveNameID(nameSearchResults[activeSearchResult].id)
                setInputText("")
                setSearchIsFocused(false)
                setActiveSearchResult(0)
              }
            }}
            value={inputText}
          />
          {searchIsFocused &&
            nameSearchResults
              .filter((el, i) => i < 5)
              .map(({ name, profile_path }, i) => (
                <FlexContainer
                  cursor="pointer"
                  onMouseOver={() => setActiveSearchResult(i)}
                  onClick={() => {
                    setActiveNameID(nameSearchResults[activeSearchResult].id)
                    setInputText("")
                    setSearchIsFocused(false)
                    setActiveSearchResult(0)
                  }}
                  withBorder={activeSearchResult === i}
                >
                  {profile_path ? (
                    <img
                      style={{ height: 50 }}
                      src={`${imageRoot}${profile_path}`}
                      alt={name}
                    />
                  ) : (
                    <div
                      style={{
                        height: 50,
                        width: 33.3,
                        backgroundColor: "#333",
                      }}
                    />
                  )}
                  {name}
                </FlexContainer>
              ))}
          {personDetails && (
            <FlexContainer direction="column" marginTop={5} withBorder>
              <div>{personDetails.name}</div>
              <div>{personDetails.birthday}</div>
              {personDetails.profile_path ? (
                <img
                  style={{ height: 100 }}
                  src={`${imageRoot}${personDetails.profile_path}`}
                  alt={personDetails.name}
                />
              ) : (
                <div
                  style={{ height: 100, width: 66.6, backgroundColor: "#333" }}
                />
              )}
            </FlexContainer>
          )}
        </FlexContainer>
      )}
    </div>
  )
}
