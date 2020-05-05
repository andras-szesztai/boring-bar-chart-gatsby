import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { IoIosSearch, IoIosClose } from "react-icons/io"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"

import { useDeviceType, usePrevious } from "../../hooks"
import { FlexContainer } from "../atoms"
import { useDebouncedSearch } from "../../hooks"
import { space, fontFamily, dropShadow } from "../../themes/theme"
import { themifyFontSize, themifyZIndex } from "../../themes/mixins"
import { API_ROOT, IMAGE_ROOT, COLORS } from "../../constants/moviesDashboard"
import { SearchBar } from "../organisms/templateElemets/moviesDashboard"



export default function MoviesDashboard() {
  const device = useDeviceType()
  const [activeNameID, setActiveNameID] = useState(undefined)
  const prevActiveNameID = usePrevious(activeNameID)
  const [personDetails, setPersonDetails] = useState(undefined)
  const [combinedCredits, setCombinedCredits] = useState(undefined)

  useEffect(() => {
    if (activeNameID && activeNameID !== prevActiveNameID) {
      axios
        .all([
          axios.get(
            `${API_ROOT}/person/${activeNameID}?api_key=${process.env.MDB_API_KEY}&language=en-US`
          ),
          axios.get(
            `${API_ROOT}/person/${activeNameID}/combined_credits?api_key=${process.env.MDB_API_KEY}&language=en-US`
          ),
        ])
        .then(
          axios.spread((details, credits) => {
            setPersonDetails(details.data)
            setCombinedCredits(credits.data)
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
          <SearchBar setActiveNameID={setActiveNameID}/>
          {personDetails && (
            <FlexContainer direction="column" marginTop={5} withBorder>
              <div>{personDetails.name}</div>
              <div>{personDetails.birthday}</div>
              {personDetails.profile_path ? (
                <img
                  style={{ height: 100 }}
                  src={`${IMAGE_ROOT}/${personDetails.profile_path}`}
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
