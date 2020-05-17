import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { motion } from "framer-motion"

import { colors } from "../../../../themes/theme"

export default function FavoriteStar({
  isFavorited,
  isHovered,
  color,
  isActive,
  inactiveColor,
}) {
  const topRef = useRef(null)

  useEffect(() => {
    // gsap.set(topRef.current, {
    //   transformOrigin: "50% 50%",
    //   scale: isFavorited ? 1 : 0,
    // })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    gsap
      .timeline({
        defaults: {
          duration: 0.5,
          transformOrigin: "50% 50%",
          ease: isFavorited ? "back.out(8)" : "back.in(6)",
        },
      })
      .to(topRef.current, {
        scale: isFavorited ? 1 : 0,
        ease: isFavorited ? "back.out(6)" : "back.in(4)",
      })
  }, [isFavorited])

  useEffect(() => {
    // gsap.to(".circle", {
    //   opacity: isHovered ? 1 : 0,
    //   stagger: {
    //     amount: 0.4,
    //   },
    // })
  }, [isHovered])

  const sharedCircleAttrs = {
    fill: color,
    r: 16,
    opacity: 0,
  }

  // const fill = isActive ? color : inactiveColor
  // const makeTransitionProps = attr => ({
  //   initial: { [attr]: fill },
  //   animate: {
  //     [attr]: fill,
  //   },
  //   transition: {
  //     duration: 0.3,
  //   },
  // })
  return (
    <motion.svg width="200px" viewBox="0 0 463 495.1">
      <motion.path
        fill={color}
        ref={topRef}
        d="M352,196.9c-30.8-31.5-81-32.9-113.5-3.1l-7.2,8.2l-7.2-7.2c-32-30.6-82.6-29.7-113.5,2
	c-30.5,31.7-29.5,82.1,2.2,112.6c0,0,0,0,0,0c0.3,0.3,0.6,0.6,0.9,0.9l104.4,99c8,7.6,20.5,7.6,28.4,0l104.4-99
	C382,279,382.4,228.7,352,196.9z"
      />
      <motion.path
        fill="none"
        stroke={color}
        strokeMiterlimit={10}
        strokeWidth={25}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M352,196.9c-30.8-31.5-81-32.9-113.5-3.1l-7.2,8.2l-7.2-7.2c-32-30.6-82.6-29.7-113.5,2
	c-30.5,31.7-29.5,82.1,2.2,112.6c0,0,0,0,0,0c0.3,0.3,0.6,0.6,0.9,0.9l104.4,99c8,7.6,20.5,7.6,28.4,0l104.4-99
	C382,279,382.4,228.7,352,196.9z"
      />

      <circle fill="#00AEEF" cx="231.5" cy="201.6" r="7" />
      <circle fill="#00AEEF" cx="341.9" cy="188.6" r="7" />
      <circle fill="#00AEEF" cx="122.6" cy="188.6" r="7" />
    </motion.svg>
  )
}

FavoriteStar.defaultProps = {
  color: "#ffbd69",
  inactiveColor: colors.grayLightest,
  isActive: true,
}
