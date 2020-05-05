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
import { moviesDashboardReducer } from "../../reducers"

export default function MoviesDashboard() {
  const device = useDeviceType()

  const { state, actions } = moviesDashboardReducer()
  const { dataSets } = state

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
          <SearchBar setActiveNameID={actions.setActiveNameID} />
          {dataSets.personDetails && (
            <FlexContainer direction="column" marginTop={5} withBorder>
              <div>{dataSets.personDetails.name}</div>
              <div>{dataSets.personDetails.birthday}</div>
              {dataSets.personDetails.profile_path ? (
                <img
                  style={{ height: 100 }}
                  src={`${IMAGE_ROOT}/${dataSets.personDetails.profile_path}`}
                  alt={dataSets.personDetails.name}
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
