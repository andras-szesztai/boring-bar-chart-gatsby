import React from "react"
import { Helmet } from "react-helmet"
import axios from "axios"

import { useDeviceType } from "../../hooks"
import { FlexContainer } from "../atoms"
import { useDebouncedSearch } from "../../hooks"

export default function MoviesDashboard() {
  const device = useDeviceType()
  // const { inputText, setInputText, searchResults } = useDebouncedSearch(() => {
  //   return console.log("hello")
  // })

  axios
    .get(
      "https://api.themoviedb.org/3/search/person?api_key=8b43883d50aeaa0768bde11d600708fe&language=en-US&query=Brad%20Pitt&page=1&include_adult=false"
    )
    .then(function(response) {
      console.log(response)
    })

  return (
    <>
      <Helmet title="Dashboard under construction" />
      {device === "desktop" && (
        <FlexContainer fullScreen>
          <input
            type="text"
            id="search"
            name="name search"
            size="100"
            // onChange={(e, v) => {
            //   setInputText(e.target.value)
            // }}
            // value={inputText}
          />
        </FlexContainer>
      )}
    </>
  )
}
