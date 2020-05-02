import React from "react"
import { Helmet } from "react-helmet"
import axios from "axios"

import { useDeviceType } from "../../hooks"
import { FlexContainer } from "../atoms"
import { useDebouncedSearch } from "../../hooks"

export default function MoviesDashboard() {
  const device = useDeviceType()
  const [response, setResponse] = React.useState(undefined)
  const fetchNames = text =>
    axios
      .get(
        `https://api.themoviedb.org/3/search/person?api_key=${process.env.MDB_API_KEY}&language=en-US&query=${text}&page=1&include_adult=false`
      )
      .then(function(response) {
        setResponse(response)
      })
  const { inputText, setInputText } = useDebouncedSearch(fetchNames, 1000)

  return (
    <>
      <Helmet title="Dashboard under construction" />
      {device === "desktop" && (
        <FlexContainer fullScreen>
          <div>{`${process.env.GATSBY_WELCOME_MESSAGE}`}</div>
          <input
            type="text"
            id="search"
            name="name search"
            size="100"
            onChange={(e, v) => {
              setInputText(e.target.value)
            }}
            value={inputText}
          />
        </FlexContainer>
      )}
    </>
  )
}
