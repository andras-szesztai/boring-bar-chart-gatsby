import React, { useState, useEffect, useRef } from "react"
import gsap from "gsap"
import styled from "styled-components"

import animationData from "../../../../../assets/animatedIcons/favoriteStar.json"
import { usePrevious } from "../../../../../hooks"
import { motion } from "framer-motion"

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
    if (typeof prevIsPaused == "boolean") {
      if (isFavorited !== prevIsFavorited) {
        gsap.fromTo(
          topRef.current,
          {
            scale: isFavorited ? 1 : 0,
          },
          {
            scale: isFavorited ? 0 : 1,
            ease: !isFavorited && "elastic.out(1, 0.3)",
          }
        )
        // .fromTo(".first-particule", { x: -90, y: -160, opacity: 0 }, "-=.25")
        // .fromTo(".second-particule", { y: -240, opacity: 0 }, "-=.25")
        // .fromTo(".third-particule", { x: 100, y: -160, opacity: 0 }, "-=.25")
      }
    }
  }, [firstRender, prevIsPaused, isPaused, isFavorited, prevIsFavorited])

  return (
    <motion.svg
      width="25px"
      viewBox="0 0 354.8 410"
    >
      <path
        fill="#f3c623"
        ref={topRef}
        style={{
          transformOrigin: "center center",
        }}
        d="M245.2,296.2l55.5-54.2c2.7-2.6,3.6-6.5,2.5-10c-1.2-3.5-4.2-6.1-7.8-6.6l-76.8-11.1l-34.3-69.6
	c-1.7-3.2-5-5.4-8.7-5.4c-3.7,0-7.1,2.1-8.7,5.4l-34.3,69.6l-76.8,11.1c-3.6,0.5-6.7,3.1-7.8,6.6c-1.2,3.5-0.2,7.4,2.5,10l55.5,54.2
	l-13.1,76.5c-0.6,3.6,0.8,7.3,3.9,9.5c3,2.1,6.9,2.5,10.2,0.7l68.7-36.1l68.7,36.1c1.4,0.8,3,1.1,4.5,1.1c2,0,4-0.6,5.7-1.9
	c3-2.2,4.5-5.8,3.9-9.5L245.2,296.2z"
      />
    </motion.svg>
  )
}
