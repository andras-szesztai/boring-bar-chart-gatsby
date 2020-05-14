import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import Lottie from "react-lottie"

import { FavoriteStar as FavoriteStarIcon } from "../../../../../assets/icons/"
import { COLORS } from "../../../../../constants/moviesDashboard"
import animationData from "../../../../../assets/animatedIcons/favoriteStar.json"

export default function FavoriteStar({ isFavorited }) {
  const defaultOptions = {
    loop: false,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  return isFavorited ? (
    <FavoriteStarIcon width={20} height={20} fill={COLORS.favorite} />
  ) : (
    <div style={{ transform: "translate(-5px, 2.6px)"}}>
      <Lottie
        options={defaultOptions}
        isPaused={true}
        direction={0}
        width={30}
        height={30}
        isClickToPauseDisabled={true}
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
    </div>
  )
}
