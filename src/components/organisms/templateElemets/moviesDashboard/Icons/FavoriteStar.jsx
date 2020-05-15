import React, { useState, useEffect, useRef } from "react"
import Lottie from "react-lottie"
import gsap from "gsap"

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
  const topRef = useRef(null)
  const bgRef = useRef(null)

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
    if (typeof prevIsPaused == "boolean" && isFavorited !== prevIsFavorited) {
      // TODO: setup timeline
      gsap.fromTo(
        topRef.current,
        { scale: isFavorited ? 0 : 1, transformOrigin: "center" },
        {
          scale: isFavorited ? 1 : 0,
          transformOrigin: "center",
          duration: 1,
          ease: isFavorited && "elastic.out(1, 0.3)"
        }
      )
      // gsap.fromTo(
      //   bgRef.current,
      //   { scale: isFavorited ? 1 : 0,  transformOrigin: "center"  },
      //   { scale: isFavorited ? 0 : 1,  transformOrigin: "center"  }
      // )
    }
    // if (
    //   typeof prevIsPaused == "boolean" &&
    //   firstRender &&
    //   !prevIsPaused &&
    //   isPaused
    // ) {
    //   setFirstRender(false)
    // }
  }, [firstRender, prevIsPaused, isPaused, isFavorited, prevIsFavorited])

  return (
    <div>
      {/* <Lottie
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
      /> */}

      <svg x="0px" y="0px" width="30px" viewBox="-50 -50 476.3 379.52">
        <path
          ref={bgRef}
          fill="#ffbd69"
          d="M288.9,26.9c-33.6-34.7-89.7-35.9-124.4-3.4l-7.8,9l-7.8-7.8C112.9-8.9,58-7.8,24.4,26.9s-32.5,90.8,3.4,124.4
	l130,123.3l130-123.3C321.4,117.7,322.5,62.8,288.9,26.9z"
        />
        <path
          ref={topRef}
          fill="#ff6363"
          d="M288.9,26.9c-33.6-34.7-89.7-35.9-124.4-3.4l-7.8,9l-7.8-7.8C112.9-8.9,58-7.8,24.4,26.9s-32.5,90.8,3.4,124.4
	l130,123.3l130-123.3C321.4,117.7,322.5,62.8,288.9,26.9z"
        />
      </svg>
    </div>
  )
}
