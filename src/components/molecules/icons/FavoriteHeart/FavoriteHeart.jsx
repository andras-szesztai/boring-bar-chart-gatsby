import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { motion } from "framer-motion"

import { colors } from "../../../../themes/theme"
import { makeIconColorTransitionProps } from "../../../../utils/svgElementHelpers"

const circlesData = [
  {
    className: "one",
    cx: 122.6,
    cy: 188.6,
  },
  {
    className: "two",
    cx: 231.5,
    cy: 200,
  },
  {
    className: "three",
    cx: 341.9,
    cy: 188.6,
  },
]

export default function FavoriteStar({
  isFavorited,
  isHovered,
  color,
  isActive,
  inactiveColor,
  size,
}) {
  const topRef = useRef(null)

  useEffect(() => {
    gsap.set(topRef.current, {
      transformOrigin: "50% 50%",
      scale: isFavorited ? 1 : 0,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    gsap
      .timeline({
        defaults: {
          duration: 0.5,
          transformOrigin: "50% 50%",
          ease: isFavorited ? "back.out(6)" : "back.in(4)",
        },
      })
      .to(topRef.current, {
        scale: isFavorited ? 1 : 0,
      })
      .to(
        ".main-heart-one",
        {
          y: isFavorited ? -70 : 0,
          x: isFavorited ? -50 : 0,
        },
        isFavorited ? "-=0.4" : "-=0.5"
      )
      .to(
        ".main-heart-two",
        {
          y: isFavorited ? -115 : 0,
        },
        "<"
      )
      .to(
        ".main-heart-three",
        {
          y: isFavorited ? -70 : 0,
          x: isFavorited ? 50 : 0,
        },
        "<"
      )
  }, [isFavorited])

  useEffect(() => {
    gsap.to(".heart-circle", {
      opacity: isHovered ? 1 : 0,
      stagger: {
        amount: 0.2,
      },
    })
  }, [isHovered])

  const sharedCircleAttrs = {
    fill: color,
    r: 14,
    opacity: 0,
  }

  const fill = isActive ? color : inactiveColor
  return (
    <motion.svg width={size} viewBox="0 0 463 495.1">
      <motion.path
        {...makeIconColorTransitionProps("fill", fill)}
        ref={topRef}
        d="M352,196.9c-30.8-31.5-81-32.9-113.5-3.1l-7.2,8.2l-7.2-7.2c-32-30.6-82.6-29.7-113.5,2
	c-30.5,31.7-29.5,82.1,2.2,112.6c0,0,0,0,0,0c0.3,0.3,0.6,0.6,0.9,0.9l104.4,99c8,7.6,20.5,7.6,28.4,0l104.4-99
	C382,279,382.4,228.7,352,196.9z"
      />
      <motion.path
        fill="none"
        {...makeIconColorTransitionProps("stroke", fill)}
        strokeMiterlimit={10}
        strokeWidth={25}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M352,196.9c-30.8-31.5-81-32.9-113.5-3.1l-7.2,8.2l-7.2-7.2c-32-30.6-82.6-29.7-113.5,2
	c-30.5,31.7-29.5,82.1,2.2,112.6c0,0,0,0,0,0c0.3,0.3,0.6,0.6,0.9,0.9l104.4,99c8,7.6,20.5,7.6,28.4,0l104.4-99
	C382,279,382.4,228.7,352,196.9z"
      />
      {circlesData.map(({ className, ...otherProps }) => (
        <circle
          key={className}
          className={`main-heart-${className} heart-circle`}
          {...otherProps}
          {...sharedCircleAttrs}
        />
      ))}
    </motion.svg>
  )
}

FavoriteStar.defaultProps = {
  color: "#ffbd69",
  inactiveColor: colors.grayLightest,
  isActive: true,
  size: 40,
}
