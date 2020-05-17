import React, { useState } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import _ from "lodash"

import { space, dropShadow, colors } from "../../../../../themes/theme"
import { COLORS, TRANSITION } from "../../../../../constants/moviesDashboard"
import { themifyFontSize, themifyZIndex } from "../../../../../themes/mixins"
import { IoMdInformationCircle } from "react-icons/io"
import { FavoriteStar, FavoriteHeart } from "../../../../molecules"

const Container = styled(motion.div)`
  position: fixed;
  display: flex;

  background-color: #fff;
  filter: drop-shadow(${dropShadow.primary})
    drop-shadow(${dropShadow.secondary});
  border-radius: ${space[1]}px;

  width: auto;
  height: 80px;

  bottom: ${space[2]}px;
  left: ${space[2]}px;
`

const RecentListContainer = styled(motion.div)`
  width: 200px;
  height: 70px;

  background-color: red;
  border-radius: ${space[1]}px;
`

const TextContainer = styled(motion.div)`
  font-weight: 500;
  font-size: ${themifyFontSize(2)};
  color: ${COLORS.textColor};
  font-family: inherit;
`

const ControlCollapsed = styled(motion.div)`
  height: 100%;
  width: 200px;
  padding: ${space[2]}px ${space[3]}px;

  display: grid;
  grid-template-rows: repeat(2, 1fr);
`

const Flex = styled.div`
  display: flex;
  flex-grow: 1;
  align-self: "center";
`

export default function FavoritesList() {
  const [isPersonsActive, setIsPersonsActive] = useState(true)
  const [isMoviesActive, setIsMoviesActive] = useState(true)

  return (
    <Container
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        ...TRANSITION.primary,
      }}
    >
      <ControlCollapsed>
        <TextContainer style={{ alignSelf: "center" }}>
          Your recent favorites{" "}
          <motion.div
            style={{ display: "inline-block" }}
            whileHover={{ scale: 1.3 }}
          >
            <IoMdInformationCircle
              size={18}
              color={COLORS.textColor}
              style={{ transform: "translate(1px, 3px)" }}
            />
          </motion.div>
        </TextContainer>
        <Flex>
          <TextContainer style={{ fontWeight: 300, alignSelf: "center" }}>
            Show:
          </TextContainer>
          <Flex
            style={{ justifyContent: "space-evenly", alignItems: "center" }}
          >
            <motion.div
              whileHover={{ scale: 1.3 }}
              style={{ cursor: "pointer" }}
              onClick={() => setIsPersonsActive(prev => !prev)}
            >
              <FavoriteStar
                isFavorited={true}
                isHovered={false}
                isActive={isPersonsActive}
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.3 }}
              initial={{ y: -3 }}
              style={{ cursor: "pointer" }}
              onClick={() => setIsMoviesActive(prev => !prev)}
            >
              <FavoriteHeart
                isFavorited={true}
                isHovered={false}
                isActive={isMoviesActive}
              />
            </motion.div>
          </Flex>
        </Flex>
      </ControlCollapsed>
      <RecentListContainer>List</RecentListContainer>
    </Container>
  )
}
