import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import Lottie from "react-lottie"

import {
  useDeviceType,
  useLocalStorage,
  useFetchData,
  usePrevious,
} from "../../hooks"
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
  cursor: pointer;
`

export default function MoviesDashboard() {
  const device = useDeviceType()

  const { state, prevState, actions } = moviesDashboardReducer()

  const [favoritePersons, setFavoritePerson] = useLocalStorage(
    LOCAL_STORE_ACCESSORS.favoritePersons,
    []
  )

  const { response } = useFetchData(
    "http://assets.ctfassets.net/w36cqgpg2pdu/52FMj0fox03PfBqI6xNaE7/3019b0f81ff724418d716a3fd03f172c/bookmark.json"
  )

  // Frame 60 when it ends

  const [isBMarked, setIsBMarked] = useState(false)
  const prevIsBMarked = usePrevious(isBMarked)
  const [isPaused, setIsPaused] = useState(true)
  useEffect(() => {
    if (!prevIsBMarked && isBMarked && isPaused) {
      setIsPaused(false)
    }
    if (prevIsBMarked && !isBMarked && isPaused) {
      setIsPaused(false)
    }
  }, [prevIsBMarked, isBMarked, isPaused])

  const defaultOptions = {
    loop: false,
    animationData: response,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
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
          <LottieTest onClick={() => setIsBMarked(prev => !prev)}>
            <Lottie
              options={defaultOptions}
              // isPaused={isPaused}
              direction={-1}
              isClickToPauseDisabled={true}
              segments={[64, 65]}
              // eventListeners={[
              //   {
              //     eventName: "enterFrame",
              //     callback: ({ currentTime, direction }) => {
              //       if (direction && currentTime >= 65) {
              //         setIsPaused(true)
              //       }
              //       if (!direction && currentTime <= 0) {
              //         setIsPaused(true)
              //       }
              //     },
              //   },
              // ]}
            />
          </LottieTest>
        </div>
      )}
    </>
  )
}
