import React, { useEffect, useRef } from "react"
import gsap from "gsap"

import { motion } from "framer-motion"

export default function FavoriteStar({ isFavorited, isHovered }) {
  const topRef = useRef(null)

  useEffect(() => {
    gsap
      .timeline()
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
      .to(
        ".main-three",
        {
          y: isFavorited ? -75 : 0,
          duration: 0.5,
          transformOrigin: "50% 50%",
          ease: isFavorited ? "back.out(8)" : "back.in(6)",
        },
        "<"
      )
      .to(
        ".main-four",
        {
          y: isFavorited ? -20 : 0,
          x: isFavorited ? -70 : 0,
          duration: 0.5,
          transformOrigin: "50% 50%",
          ease: isFavorited ? "back.out(8)" : "back.in(6)",
        },
        "<"
      )
      .to(
        ".main-five",
        {
          y: isFavorited ? 50 : 0,
          x: isFavorited ? -45 : 0,
          duration: 0.5,
          transformOrigin: "50% 50%",
          ease: isFavorited ? "back.out(8)" : "back.in(6)",
        },
        "<"
      )
  }, [isFavorited])

  useEffect(() => {
    gsap.to(".circle", {
      opacity: isHovered ? 1 : 0,
      stagger: 0.1,
    })
  }, [isHovered])

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
        className="main-one circle"
        fill="#ffbd69"
        cx="388.7"
        cy="442.1"
        r={16}
      />
      <circle
        className="main-two circle"
        fill="#ffbd69"
        cx="447.1"
        cy="259.9"
        r={16}
      />
      <circle
        className="main-three circle"
        fill="#ffbd69"
        cx="293.3"
        cy="150.8"
        r={16}
      />
      <circle
        className="main-four circle"
        fill="#ffbd69"
        cx="139.6"
        cy="259.9"
        r={16}
      />
      <circle
        fill="#ffbd69"
        className="main-five circle"
        cx="195.6"
        cy="442.1"
        r={16}
      />
    </motion.svg>
  )
}
