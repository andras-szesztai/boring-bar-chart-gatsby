import React, { useEffect, useRef } from "react"
import gsap from "gsap"

const circlesData = [
  {
    className: "one",
    cx: 388.7,
    cy: 442.1,
  },
  {
    className: "two",
    cx: 447.1,
    cy: 259.9,
  },
  {
    className: "three",
    cx: 293.3,
    cy: 150.8,
  },
  {
    className: "four",
    cx: 139.6,
    cy: 259.9,
  },
  {
    className: "five",
    cx: 195.6,
    cy: 442.1,
  },
]

export default function FavoriteStar({ isFavorited, isHovered }) {
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
          ease: isFavorited ? "back.out(8)" : "back.in(6)",
        },
      })
      .to(topRef.current, {
        scale: isFavorited ? 1 : 0,
        ease: isFavorited ? "back.out(6)" : "back.in(4)",
      })
      .to(
        ".main-one",
        {
          y: isFavorited ? 60 : 0,
          x: isFavorited ? 45 : 0,
        },
        isFavorited ? "-=0.4" : "-=0.5"
      )
      .to(
        ".main-two",
        {
          y: isFavorited ? -30 : 0,
          x: isFavorited ? 70 : 0,
        },
        "<"
      )
      .to(
        ".main-three",
        {
          y: isFavorited ? -75 : 0,
        },
        "<"
      )
      .to(
        ".main-four",
        {
          y: isFavorited ? -20 : 0,
          x: isFavorited ? -70 : 0,
        },
        "<"
      )
      .to(
        ".main-five",
        {
          y: isFavorited ? 50 : 0,
          x: isFavorited ? -45 : 0,
        },
        "<"
      )
  }, [isFavorited])

  useEffect(() => {
    gsap.to(".circle", {
      opacity: isHovered ? 1 : 0,
      stagger: {
        amount: 0.5,
      },
    })
  }, [isHovered])

  const sharedCircleAttrs = {
    fill: "#ffbd69",
    r: 16,
    opacity: 0,
  }

  return (
    <svg width="35px" viewBox="0 0 591.2 591.2">
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
        strokeWidth={25}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        d="M380.6,338.8l69.6-67.9c3.3-3.2,4.5-8.1,3.1-12.5c-1.5-4.4-5.3-7.6-9.8-8.3l-96.2-14l-43-87.2
	c-2.1-4.1-6.3-6.7-11-6.7c-4.6,0-8.8,2.6-11,6.8l-43,87.2l-96.2,14c-4.5,0.6-8.4,3.9-9.8,8.3s-0.2,9.2,3.1,12.5l69.6,67.9
	l-16.5,95.8c-0.8,4.5,1.1,9.2,4.9,11.9c3.7,2.7,8.7,3.1,12.8,0.9l86.1-45.3l86.1,45.3c1.8,1,3.7,1.4,5.7,1.4c2.5,0,5-0.8,7.1-2.4
	c3.7-2.8,5.6-7.3,4.9-11.9L380.6,338.8z"
      />
      {circlesData.map(({ className, ...otherProps }) => (
        <circle
          key={className}
          className={`main-${className} circle`}
          {...otherProps}
          {...sharedCircleAttrs}
        />
      ))}
    </svg>
  )
}
