import React, { useState, useEffect } from "react"
import Lottie from "react-lottie"

import animationData from "../../../../../assets/animatedIcons/favoriteStar.json"
import { usePrevious } from "../../../../../hooks"

export default function FavoriteStar({ isFavorited }) {
  const prevIsFavorited = usePrevious(isFavorited)
  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  const [isPaused, setIsPaused] = useState(true)
  const prevIsPaused = usePrevious(isPaused)
  useEffect(() => {
    if (typeof prevIsFavorited == "boolean") {
      if (isFavorited !== prevIsFavorited) {
        setIsPaused(false)
      }
    } else {
      setIsPaused(false)
    }
  }, [isFavorited, prevIsFavorited])
  const [firstRender, setFirstRender] = useState(true)
  
  useEffect(() => {
    if (
      typeof prevIsPaused == "boolean" &&
      firstRender &&
      !prevIsPaused &&
      isPaused
    ) {
      setFirstRender(false)
    }
  }, [firstRender, prevIsPaused, isPaused])

  return (
    <div>
      <Lottie
        options={defaultOptions}
        isPaused={isPaused}
        width={32}
        height={32}
        speed={firstRender ? 100 : 1.1}
        direction={isFavorited ? 1 : -1}
        isClickToPauseDisabled={true}
        eventListeners={[
          {
            eventName: "complete",
            callback: () => {
              setIsPaused(true)
            },
          },
        ]}
      />
    </div>
  )
}
