import React, { useState, useEffect, useRef } from "react"
import gsap from "gsap"
import styled from "styled-components"

import animationData from "../../../../../assets/animatedIcons/favoriteStar.json"
import { usePrevious } from "../../../../../hooks"
import { motion } from "framer-motion"

export default function FavoriteStar({ isFavorited }) {
  const prevIsFavorited = usePrevious(isFavorited)

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
    const animationOn = gsap
      .timeline({ paused: true })
      .to(topRef.current, {
        scale: isFavorited ? 1 : 0,
        duration: 0.5,
        transformOrigin: "50% 50%",
        ease: isFavorited ? "back.out(5)" : "back.in(4)",
      })
      .to(
        ".main-one",
        {
          y: isFavorited ? 60 : 0,
          x: isFavorited ? 45 : 0,
          duration: 0.5,
          transformOrigin: "50% 50%",
          ease: isFavorited ? "back.out(8)" : "back.in(6)",
        },
        isFavorited ? "-=0.4" : "-=0.5"
      )
      .to(
        ".main-two",
        {
          y: isFavorited ? -30 : 0,
          x: isFavorited ? 70 : 0,
          duration: 0.5,
          transformOrigin: "50% 50%",
          ease: isFavorited ? "back.out(8)" : "back.in(6)",
        },
        "<"
      )
    if (typeof prevIsPaused == "boolean") {
      if (isFavorited !== prevIsFavorited) {
        animationOn.play()
      }
    }
  }, [firstRender, prevIsPaused, isPaused, isFavorited, prevIsFavorited])

  return (
    <motion.svg width="35px" viewBox="0 0 591.2 591.2">
      <path
        ref={topRef}
        fill="#ffbd69"
        d="M380.6,338.8l69.6-67.9c3.3-3.2,4.5-8.1,3.1-12.5c-1.5-4.4-5.3-7.6-9.8-8.3l-96.2-14l-43-87.2
	c-2.1-4.1-6.3-6.7-11-6.7s-8.8,2.6-11,6.8l-43,87.2l-96.2,14c-4.5,0.6-8.4,3.9-9.8,8.3s-0.2,9.2,3.1,12.5l69.6,67.9l-16.5,95.8
	c-0.8,4.5,1.1,9.2,4.9,11.9c3.7,2.7,8.7,3.1,12.8,0.9l86.1-45.3l86.1,45.3c1.8,1,3.7,1.4,5.7,1.4c2.5,0,5-0.8,7.1-2.4
	c3.7-2.8,5.6-7.3,4.9-11.9L380.6,338.8z"
      />
      <path
        fill="none"
        stroke="#ffbd69"
        strokeWidth={20}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        d="M380.6,338.8l69.6-67.9c3.3-3.2,4.5-8.1,3.1-12.5c-1.5-4.4-5.3-7.6-9.8-8.3l-96.2-14l-43-87.2
	c-2.1-4.1-6.3-6.7-11-6.7c-4.6,0-8.8,2.6-11,6.8l-43,87.2l-96.2,14c-4.5,0.6-8.4,3.9-9.8,8.3s-0.2,9.2,3.1,12.5l69.6,67.9
	l-16.5,95.8c-0.8,4.5,1.1,9.2,4.9,11.9c3.7,2.7,8.7,3.1,12.8,0.9l86.1-45.3l86.1,45.3c1.8,1,3.7,1.4,5.7,1.4c2.5,0,5-0.8,7.1-2.4
	c3.7-2.8,5.6-7.3,4.9-11.9L380.6,338.8z"
      />
      <circle
        className="main-one"
        fill="#ffbd69"
        cx="388.7"
        cy="442.1"
        r={12}
      />
      <circle
        className="main-two"
        fill="#ffbd69"
        cx="447.1"
        cy="259.9"
        r={12}
      />
      {/* 
      <circle fill="red" cx="139.6" cy="259.9" r="8" />
      <circle fill="red" cx="293.3" cy="150.8" r="8" /> */}
      {/*
      <circle fill="red" cx="293.3" cy="398.2" r="8" />
      <circle fill="#000" cx="377.9" cy="338.1" r="6.8" />
      <circle fill="#000" cx="240.4" cy="238.2" r="6.8" />
      <circle fill="#000" cx="345.8" cy="238.2" r="6.8" />
      <circle fill="red" cx="209.3" cy="338.1" r="8" />
      */}
    </motion.svg>
  )
}
