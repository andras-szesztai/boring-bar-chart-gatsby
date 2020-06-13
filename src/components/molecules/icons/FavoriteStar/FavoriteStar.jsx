import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { motion } from "framer-motion"

import { colors } from "../../../../themes/theme"
import { makeIconColorTransitionProps } from "../../../../utils/svgElementHelpers"
import { useArrayRefs } from "../../../../hooks"

const circlesData = [
  {
    cx: 388.7,
    cy: 442.1,
  },
  {
    cx: 447.1,
    cy: 259.9,
  },
  {
    cx: 293.3,
    cy: 150.8,
  },
  {
    cx: 139.6,
    cy: 259.9,
  },
  {
    cx: 195.6,
    cy: 442.1,
  },
]

export default function FavoriteStar({
  isFavorited,
  isHovered,
  color,
  isActive,
  inactiveColor,
  width
}) {
  const topRef = useRef(null)
  const circleRef = useArrayRefs(5)

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
          ease: isFavorited ? "back.out(8)" : "back.in(6)",
        },
      })
      .to(topRef.current, {
        scale: isFavorited ? 1 : 0,
        ease: isFavorited ? "back.out(6)" : "back.in(4)",
      })
      .to(
        circleRef.current[0].current,
        {
          y: isFavorited ? 60 : 0,
          x: isFavorited ? 45 : 0,
        },
        isFavorited ? "-=0.4" : "-=0.5"
      )
      .to(
        circleRef.current[1].current,
        {
          y: isFavorited ? -30 : 0,
          x: isFavorited ? 70 : 0,
        },
        "<"
      )
      .to(
        circleRef.current[2].current,
        {
          y: isFavorited ? -75 : 0,
        },
        "<"
      )
      .to(
        circleRef.current[3].current,
        {
          y: isFavorited ? -20 : 0,
          x: isFavorited ? -70 : 0,
        },
        "<"
      )
      .to(
        circleRef.current[4].current,
        {
          y: isFavorited ? 50 : 0,
          x: isFavorited ? -45 : 0,
        },
        "<"
      )
  }, [circleRef, isFavorited])

  useEffect(() => {
    circleRef.current.forEach(circle =>
      gsap.to(circle.current, {
        opacity: isHovered ? 1 : 0,
        stagger: {
          amount: 0.4,
        },
      })
    )
  }, [circleRef, isHovered])

  const sharedCircleAttrs = {
    fill: color,
    r: 14,
    opacity: 0,
  }

  const fill = isActive ? color : inactiveColor
  return (
    <motion.svg width={width} viewBox="0 0 591.2 591.2">
      <motion.path
        ref={topRef}
        {...makeIconColorTransitionProps("fill", fill)}
        d="M380.6,338.8l69.6-67.9c3.3-3.2,4.5-8.1,3.1-12.5c-1.5-4.4-5.3-7.6-9.8-8.3l-96.2-14l-43-87.2
	c-2.1-4.1-6.3-6.7-11-6.7s-8.8,2.6-11,6.8l-43,87.2l-96.2,14c-4.5,0.6-8.4,3.9-9.8,8.3s-0.2,9.2,3.1,12.5l69.6,67.9l-16.5,95.8
	c-0.8,4.5,1.1,9.2,4.9,11.9c3.7,2.7,8.7,3.1,12.8,0.9l86.1-45.3l86.1,45.3c1.8,1,3.7,1.4,5.7,1.4c2.5,0,5-0.8,7.1-2.4
	c3.7-2.8,5.6-7.3,4.9-11.9L380.6,338.8z"
      />
      <motion.path
        fill="none"
        {...makeIconColorTransitionProps("stroke", fill)}
        strokeWidth={25}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        d="M380.6,338.8l69.6-67.9c3.3-3.2,4.5-8.1,3.1-12.5c-1.5-4.4-5.3-7.6-9.8-8.3l-96.2-14l-43-87.2
	c-2.1-4.1-6.3-6.7-11-6.7c-4.6,0-8.8,2.6-11,6.8l-43,87.2l-96.2,14c-4.5,0.6-8.4,3.9-9.8,8.3s-0.2,9.2,3.1,12.5l69.6,67.9
	l-16.5,95.8c-0.8,4.5,1.1,9.2,4.9,11.9c3.7,2.7,8.7,3.1,12.8,0.9l86.1-45.3l86.1,45.3c1.8,1,3.7,1.4,5.7,1.4c2.5,0,5-0.8,7.1-2.4
	c3.7-2.8,5.6-7.3,4.9-11.9L380.6,338.8z"
      />
      {circlesData.map((coors, i) => (
        <circle
          key={i}
          ref={circleRef.current[i]}
          {...coors}
          {...sharedCircleAttrs}
        />
      ))}
    </motion.svg>
  )
}

FavoriteStar.defaultProps = {
  color: "#FFDA47",
  inactiveColor: colors.grayLightest,
  isActive: true,
  width: 35
}
