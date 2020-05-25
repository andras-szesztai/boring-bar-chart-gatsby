import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import { IoIosSearch } from "react-icons/io"

import { HoverControlIconContainer, MouseDownAnimation } from "../RecentList"
import { COLORS } from "../../../../../../../constants/moviesDashboard"

const SearchControl = ({
  activeNameID,
  id,
  setActiveNameID,
  clickedSearch,
  setClickedSearch,
}) => {
  const [isSearchHovered, setIsSearchHovered] = useState(false)
  const timeOut = useRef(null)

  return (
    <HoverControlIconContainer
      style={{
        color: activeNameID === id && "rgba(255, 255, 255, .25)",
      }}
      onMouseEnter={() => {
        if (activeNameID !== id) {
          setIsSearchHovered(true)
        }
      }}
      onMouseLeave={() => {
        clearTimeout(timeOut.current)
        setClickedSearch(undefined)
        setIsSearchHovered(false)
      }}
      onMouseDown={() => {
        if (activeNameID !== id) {
          setClickedSearch(id)
          timeOut.current = setTimeout(() => setActiveNameID(id), 1000)
        }
      }}
      onMouseUp={() => {
        clearTimeout(timeOut.current)
        setClickedSearch(undefined)
      }}
      whileTap={
        activeNameID === id && {
          x: 3,
          transition: {
            flip: Infinity,
            duration: 0.2,
            ease: [0.65, 0, 0.35, 1],
          },
        }
      }
    >
      {activeNameID !== id && (
        <MouseDownAnimation
          initial={{
            width: "0%",
            x: -5,
            backgroundColor: "#fff",
            zIndex: 1,
            opacity: 0.25,
          }}
          animate={{
            width: clickedSearch && clickedSearch === id ? "120%" : "0%",
            opacity: clickedSearch && clickedSearch === id ? .5 : 0.25,
          }}
          transition={{
            duration: 1,
            type: "tween",
            ease: [0.65, 0, 0.35, 1],
          }}
        />
      )}
      <div style={{ display: "flex", zIndex: 2 }}>
        <motion.div
          style={{ marginRight: 4 }}
          initial={{ y: 2 }}
          animate={{ scale: isSearchHovered ? 1.4 : 1 }}
        >
          <IoIosSearch size={14} />
        </motion.div>
        Search
      </div>
    </HoverControlIconContainer>
  )
}

export default SearchControl
