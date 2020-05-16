import React, { useState, useEffect, useRef } from "react"
import Lottie from "react-lottie"
import gsap from "gsap"
import styled from "styled-components"

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
    if (typeof prevIsPaused == "boolean") {
      if (isFavorited && !prevIsFavorited) {
        gsap
          .timeline()
          .to(topRef.current, { scale: 1 })
          .to(".first-particule", { x: -90, y: -160, opacity: 0 }, "-=.25")
          .to(".second-particule", { y: -240, opacity: 0 }, "-=.25")
          .to(".third-particule", { x: 90, y: -160, opacity: 0 }, "-=.25")
      }
      if (!isFavorited && prevIsFavorited) {
        gsap
          .timeline()
          .to(topRef.current, { scale: 0 })
          .to(".first-particule", { x: 0, y: 0, opacity: 1 })
          .to(".second-particule", { x: 0, y: 0, opacity: 1 })
          .to(".third-particule", { x: 0, y: 0, opacity: 1 })
      }
    }
  }, [firstRender, prevIsPaused, isPaused, isFavorited, prevIsFavorited])

  return (
    <div>
      <svg
        x="0px"
        y="0px"
        width="25px"
        viewBox="0 0 354.8 410"
        style={{
          transformOrigin: "25px 25px",
        }}
      >
        <path fill="#ffff" d="M354.8,410H0V0h354.8V410z" />
        <path
          fill="#e5e5e5"
          ref={bgRef}
          d="M245.2,296.2l55.5-54.2c2.7-2.6,3.6-6.5,2.5-10c-1.2-3.5-4.2-6.1-7.8-6.6l-76.8-11.1l-34.3-69.6
	c-1.7-3.2-5-5.4-8.7-5.4c-3.7,0-7.1,2.1-8.7,5.4l-34.3,69.6l-76.8,11.1c-3.6,0.5-6.7,3.1-7.8,6.6c-1.2,3.5-0.2,7.4,2.5,10l55.5,54.2
	l-13.1,76.5c-0.6,3.6,0.8,7.3,3.9,9.5c3,2.1,6.9,2.5,10.2,0.7l68.7-36.1l68.7,36.1c1.4,0.8,3,1.1,4.5,1.1c2,0,4-0.6,5.7-1.9
	c3-2.2,4.5-5.8,3.9-9.5L245.2,296.2z"
        />
        <path
          fill="#f3c623"
          ref={topRef}
          style={{
            transformOrigin: "-50px -50px",
          }}
          d="M245.2,296.2l55.5-54.2c2.7-2.6,3.6-6.5,2.5-10c-1.2-3.5-4.2-6.1-7.8-6.6l-76.8-11.1l-34.3-69.6
	c-1.7-3.2-5-5.4-8.7-5.4c-3.7,0-7.1,2.1-8.7,5.4l-34.3,69.6l-76.8,11.1c-3.6,0.5-6.7,3.1-7.8,6.6c-1.2,3.5-0.2,7.4,2.5,10l55.5,54.2
	l-13.1,76.5c-0.6,3.6,0.8,7.3,3.9,9.5c3,2.1,6.9,2.5,10.2,0.7l68.7-36.1l68.7,36.1c1.4,0.8,3,1.1,4.5,1.1c2,0,4-0.6,5.7-1.9
	c3-2.2,4.5-5.8,3.9-9.5L245.2,296.2z"
        />
        <path
          fill="#333"
          className="first-particule"
          d="M180.9,288L180.9,288c-5.1,3.2-11.8,1.6-15-3.5l-27.2-43.4c-3.2-5.1-1.6-11.8,3.5-15l0,0
	c5.1-3.2,11.8-1.6,15,3.5l27.2,43.4C187.5,278.1,186,284.8,180.9,288z"
        />
        <path
          fill="#f3c623"
          className="second-particule"
          d="M175.5,289.4L175.5,289.4c-6,0-10.9-4.9-10.9-10.9V210c0-6,4.9-10.9,10.9-10.9h0c6,0,10.9,4.9,10.9,10.9v68.5
	C186.4,284.6,181.5,289.4,175.5,289.4z"
        />
        <path
          fill="#f3c623"
          className="third-particule"
          d="M169.8,287.6L169.8,287.6c-5-3.3-6.5-10-3.2-15.1l28-42.9c3.3-5,10-6.5,15.1-3.2l0,0c5,3.3,6.5,10,3.2,15.1
	l-28,42.9C181.6,289.5,174.9,290.9,169.8,287.6z"
        />
      </svg>
    </div>
  )
}
