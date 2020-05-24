import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import { IoIosClose } from "react-icons/io"

import { MouseDownAnimation, HoverControlIconContainer } from "../RecentList"

const RemoveControl = ({
  id,
  setFavoritePersons,
  clickedRemove,
  setClickedRemove,
}) => {
  const [isRemoveHovered, setIsRemoveHovered] = useState(false)
  const timeOut = useRef(null)

  return (
    <HoverControlIconContainer
      onMouseEnter={() => setIsRemoveHovered(true)}
      onMouseLeave={() => {
        clearTimeout(timeOut.current)
        setClickedRemove(undefined)
        setIsRemoveHovered(false)
      }}
      onMouseDown={() => {
        setClickedRemove(id)
        timeOut.current = setTimeout(
          () => setFavoritePersons(prev => prev.filter(d => d.id !== id)),
          1000
        )
      }}
      onMouseUp={() => {
        clearTimeout(timeOut.current)
        setClickedRemove(undefined)
      }}
    >
      <MouseDownAnimation
        initial={{ width: "0%", x: -5 }}
        animate={{
          width: clickedRemove && clickedRemove === id ? "120%" : "0%",
        }}
        transition={{
          duration: 1,
          type: "tween",
          ease: [0.65, 0, 0.35, 1],
        }}
      />
      <motion.div
        style={{ marginRight: 2 }}
        initial={{ y: 2 }}
        animate={{ scale: isRemoveHovered ? 1.6 : 1 }}
      >
        <IoIosClose size={14} />
      </motion.div>
      Remove
    </HoverControlIconContainer>
  )
}

export default RemoveControl
