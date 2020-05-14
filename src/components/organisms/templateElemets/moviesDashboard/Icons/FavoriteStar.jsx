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
import { usePrevious } from "../../../../../hooks"

export default function FavoriteStar({ isFavorited: parentFavorited }) {
  const prevParentFavorited = usePrevious(parentFavorited)
  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  const [isFavorited, setIsFavorited] = useState(parentFavorited)
  useEffect(() => {
    if (!parentFavorited && prevParentFavorited) {
      setIsFavorited(false)
    }
  }, [parentFavorited, prevParentFavorited])
  const [isClicked, setIsClicked] = useState(false)

  return isFavorited ? (
    <FavoriteStarIcon width={20} height={20} fill={COLORS.favorite} />
  ) : (
    <div
      style={{ transform: "translate(-5px, 2.6px)" }}
      onClick={() => setIsClicked(true)}
    >
      <Lottie
        options={defaultOptions}
        isPaused={isClicked}
        width={30}
        height={30}
        isClickToPauseDisabled={true}
        eventListeners={[
          {
            eventName: "complete",
            callback: () => {
              setIsFavorited(true)
            },
          },
        ]}
      />
    </div>
  )
}
