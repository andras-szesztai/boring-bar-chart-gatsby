import React, { useState, useEffect, useRef } from "react"
import Lottie from "react-lottie"
import gsap from "gsap"
import styled from "styled-components"

import animationData from "../../../../../assets/animatedIcons/favoriteStar.json"
import { usePrevious } from "../../../../../hooks"

const Container = styled.div`
  position: relative;
`

const Particule = styled.div`
  width: 10px;
  height: 2px;
  background-color: #000;
  border-radius: 5px;

  position: absolute;
  top: 50%;
  left: 50%;
`

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
          ease: isFavorited && "elastic.out(1, 0.3)",
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
    <Container>
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

      <svg x="0px" y="0px" width="30px" viewBox="0 0 339.1 339.1">
        <path fill="#FFF" d="M339.1,339.1H0V0h339.1V339.1z" />
        <path
          fill="#fddf97"
          d="M239.2,204l55.5-54.2c2.7-2.6,3.6-6.5,2.5-10c-1.2-3.5-4.2-6.1-7.8-6.6l-76.8-11.1l-34.3-69.6
	c-1.7-3.2-5-5.4-8.7-5.4c-3.7,0-7.1,2.1-8.7,5.4l-34.3,69.6l-76.8,11.1c-3.6,0.5-6.7,3.1-7.8,6.6c-1.2,3.5-0.2,7.4,2.5,10l55.5,54.2
	l-13.1,76.5c-0.6,3.6,0.8,7.3,3.9,9.5c3,2.1,6.9,2.5,10.2,0.7l68.7-36.1l68.7,36.1c1.4,0.8,3,1.1,4.5,1.1c2,0,4-0.6,5.7-1.9
	c3-2.2,4.5-5.8,3.9-9.5L239.2,204z"
        />
        <path
          ref={topRef}
          fill="#844685"
          d="M239.2,204l55.5-54.2c2.7-2.6,3.6-6.5,2.5-10c-1.2-3.5-4.2-6.1-7.8-6.6l-76.8-11.1l-34.3-69.6
	c-1.7-3.2-5-5.4-8.7-5.4c-3.7,0-7.1,2.1-8.7,5.4l-34.3,69.6l-76.8,11.1c-3.6,0.5-6.7,3.1-7.8,6.6c-1.2,3.5-0.2,7.4,2.5,10l55.5,54.2
	l-13.1,76.5c-0.6,3.6,0.8,7.3,3.9,9.5c3,2.1,6.9,2.5,10.2,0.7l68.7-36.1l68.7,36.1c1.4,0.8,3,1.1,4.5,1.1c2,0,4-0.6,5.7-1.9
	c3-2.2,4.5-5.8,3.9-9.5L239.2,204z"
        />
      </svg>
      <Particule />
    </Container>
  )
}
