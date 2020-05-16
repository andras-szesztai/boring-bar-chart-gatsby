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
            duration: !isFavorited ? 1 : 0.2,
            ease: !isFavorited && "elastic.out(.9, 0.3)",
            transformOrigin: "50% 50%",
          }
        )
      }
    }
  }, [firstRender, prevIsPaused, isPaused, isFavorited, prevIsFavorited])

  return (
    <motion.svg width="30px" viewBox="0 0 488.1 488.1">
      <path
        fill="#ffbd69"
        d="M331.3,287.3l69.6-67.9c3.3-3.2,4.5-8.1,3.1-12.5c-1.5-4.4-5.3-7.6-9.8-8.3l-96.2-14l-43-87.2c-2.1-4.1-6.3-6.7-11-6.7
	s-8.8,2.6-11,6.8l-43,87.2l-96.2,14c-4.5,0.6-8.4,3.9-9.8,8.3c-1.5,4.4-0.2,9.2,3.1,12.5l69.6,67.9l-16.5,95.8
	c-0.8,4.5,1.1,9.2,4.9,11.9c3.7,2.7,8.7,3.1,12.8,0.9l86.1-45.3l86.1,45.3c1.8,1,3.7,1.4,5.7,1.4c2.5,0,5-0.8,7.1-2.4
	c3.7-2.8,5.6-7.3,4.9-11.9L331.3,287.3z"
      />
      <path
        fill="#e5e5e5"
        d="M331.3,287.3l69.6-67.9c3.3-3.2,4.5-8.1,3.1-12.5c-1.5-4.4-5.3-7.6-9.8-8.3l-96.2-14l-43-87.2
	c-2.1-4.1-6.3-6.7-11-6.7s-8.8,2.6-11,6.8l-43,87.2l-96.2,14c-4.5,0.6-8.4,3.9-9.8,8.3c-1.5,4.4-0.2,9.2,3.1,12.5l69.6,67.9
	l-16.5,95.8c-0.8,4.5,1.1,9.2,4.9,11.9c3.7,2.7,8.7,3.1,12.8,0.9l86.1-45.3l86.1,45.3c1.8,1,3.7,1.4,5.7,1.4c2.5,0,5-0.8,7.1-2.4
	c3.7-2.8,5.6-7.3,4.9-11.9L331.3,287.3z"
      />
    </motion.svg>
  )
}
