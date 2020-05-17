import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import _ from "lodash"

import { useDeviceType, usePrevious } from "../../hooks"
import {
  SearchBar,
  PersonDetailCard,
} from "../organisms/templateElemets/moviesDashboard"
import { moviesDashboardReducer } from "../../reducers"
import { FavoriteHeart } from "../molecules/icons"

export default function MoviesDashboard() {
  const device = useDeviceType()

  const {
    state,
    prevState,
    actions,
    localStorageValues,
    localStorageSetters,
  } = moviesDashboardReducer()
  const { favoritePersons } = localStorageValues
  const { setFavoritePersons } = localStorageSetters

  useEffect(() => {
    favoritePersons &&
      favoritePersons.length &&
      actions.setActiveNameID(_.last(favoritePersons).id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [isTitleHovered, setIsTitleHovered] = useState(false)

  const [isFavorited, setIsFavorited] = useState(false)
  return (
    <>
      <Helmet title="Dashboard under construction" />
      {device === "desktop" && (
        <div style={{ userSelect: "none" }}>
          <SearchBar setActiveNameID={actions.setActiveNameID} />
          <PersonDetailCard
            state={state}
            prevState={prevState}
            actions={actions}
            loading={state.loading.personDetails}
            favoritePersons={favoritePersons}
            setFavoritePersons={setFavoritePersons}
          />
          <div
            onClick={() => setIsFavorited(prev => !prev)}
            onMouseEnter={() => setIsTitleHovered(true)}
            onMouseLeave={() => setIsTitleHovered(false)}
            style={{
              position: "fixed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              top: "50%",
              left: "50%",
              border: "1px solid #333",
              width: 200,
              height: 200,
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
            }}
          >
            <FavoriteHeart isFavorited={isFavorited} isHovered={isTitleHovered} />
          </div>
        </div>
      )}
    </>
  )
}
