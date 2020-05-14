import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import Reward from "react-rewards"

import { useDeviceType } from "../../hooks"
import {
  SearchBar,
  PersonDetailCard,
} from "../organisms/templateElemets/moviesDashboard"
import { moviesDashboardReducer } from "../../reducers"

export default function MoviesDashboard() {
  const device = useDeviceType()

  const { state, prevState, actions } = moviesDashboardReducer()
  const { dataSets } = state

  return (
    <>
      <Helmet title="Dashboard under construction" />
      {device === "desktop" && (
        <div style={{ userSelect: "none" }}>
          <SearchBar setActiveNameID={actions.setActiveNameID} />
          <PersonDetailCard
            dataSets={dataSets}
            prevDataSets={prevState.dataSets}
          />
        </div>
      )}
    </>
  )
}
