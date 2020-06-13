import React from "react"
import { motion } from "framer-motion"
import styled from "styled-components"
import { IoMdInformationCircle } from "react-icons/io"

import { space, dropShadow } from "../../../../../themes/theme"
import {
  HANDLE_SIZE,
  COLORS,
  TRANSITION,
} from "../../../../../constants/moviesDashboard"
import { TextContainer } from "../styles/styles"
import { FavoriteHeart } from "../../../../molecules"

const InformationContainer = styled(motion.div)`
  position: fixed;

  background-color: #fff;
  border-radius: ${space[1]}px;
  filter: drop-shadow(${dropShadow.primary})
    drop-shadow(${dropShadow.secondary});

  top: ${space[2]}px;
  left: 40%;

  height: 90px;
  width: 280px;
  z-index: 5;
  padding: ${space[1]}px ${space[2]}px ${space[2]}px ${space[2]}px;

  display: flex;

  ::after {
    content: "";
    position: absolute;
    width: ${HANDLE_SIZE}px;
    height: ${HANDLE_SIZE}px;
    border-radius: 0 0 ${space[1]}px ${space[1]}px;
    background-color: #fff;
    bottom: -${HANDLE_SIZE - 2}px;
    right: 0px;
  }
`

const IconButton = styled(motion.button)`
  position: absolute;

  bottom: -${HANDLE_SIZE - 2}px;
  right: 0px;
  z-index: 6;

  cursor: pointer;
  width: ${HANDLE_SIZE}px;
  height: ${HANDLE_SIZE}px;

  background-color: #fff;
  border: none;
  border-radius: 0 0 ${space[1]}px ${space[1]}px;
`

const Text = styled(TextContainer)`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  align-items: center;
  width: 100%;
`

const Link = styled.a`
  color: ${COLORS.textColor};
  font-weight: 500;
`

export default function InformationContainerComponent() {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [isFavorited, setIsFavorited] = React.useState(false)

  return (
    <InformationContainer
      initial={{ opacity: 0, y: -90 }}
      animate={{
        opacity: 1,
        y: isOpen ? 0 : -90,
        transition: { ...TRANSITION.primary, stiffness: 140 },
      }}
      onAnimationStart={() => !isOpen && setIsFavorited(false)}
      onAnimationComplete={() => isOpen && setIsFavorited(true)}
    >
      <Text>
        <div>
          Built with‏‏‎ ‎‏‏‎ ‎ ‎ ‎ ‎ ‎ ‎
          <span style={{ position: "relative" }}>
            <span style={{ position: "absolute", top: -5, left: -22 }}>
              <FavoriteHeart
                size={22}
                isFavorited={isFavorited}
                isHovered={isFavorited}
              />
            </span>{" "}
            by{" "}
            <Link
              href="https://twitter.com/AndSzesztai"
              target="_blank"
              rel="noopener noreferrer"
            >
              Andras Szesztai
            </Link>
          </span>
        </div>
        <div>Please feel free to contact with any idea or feedback!</div>
        <div>
          Data source:{" "}
          <Link
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Movie Database (TMDb)
          </Link>
        </div>
      </Text>

      <IconButton
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <motion.div animate={{ scale: isHovered ? 1.25 : 1 }}>
          <IoMdInformationCircle color={COLORS.textColor} size={28} />
        </motion.div>
      </IconButton>
    </InformationContainer>
  )
}
