import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import Lottie from "react-lottie"

import { useDeviceType, useLocalStorage, useFetchData } from "../../hooks"
import {
  SearchBar,
  PersonDetailCard,
} from "../organisms/templateElemets/moviesDashboard"
import { moviesDashboardReducer } from "../../reducers"
import { LOCAL_STORE_ACCESSORS } from "../../constants/moviesDashboard"

const LottieTest = styled.div`
  width: 200px;
  height: 200px;
  position: fixed;
  left: 50vw;
  top: 50vh;
  border: 1px solid #000;
`

export default function MoviesDashboard() {
  const device = useDeviceType()

  const { state, prevState, actions } = moviesDashboardReducer()

  const [favoritePersons, setFavoritePerson] = useLocalStorage(
    LOCAL_STORE_ACCESSORS.favoritePersons,
    []
  )

  const {response} = useFetchData(
    "http://assets.ctfassets.net/w36cqgpg2pdu/52FMj0fox03PfBqI6xNaE7/3019b0f81ff724418d716a3fd03f172c/bookmark.json"
  )

  console.log(response)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: response,
  }


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
          />
          <LottieTest>
            <Lottie
              options={defaultOptions}
              // height={100}
              // width={100}
            />
          </LottieTest>
        </div>
      )}
    </>
  )
}
