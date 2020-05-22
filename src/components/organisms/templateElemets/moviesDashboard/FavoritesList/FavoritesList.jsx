import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import _ from "lodash"
import useMeasure from "react-use-measure"
import { IoMdInformationCircle, IoIosArrowForward } from "react-icons/io"
import { FaExpandArrowsAlt } from "react-icons/fa"

import { space, dropShadow, colors } from "../../../../../themes/theme"
import { COLORS, TRANSITION } from "../../../../../constants/moviesDashboard"
import { themifyFontSize, themifyZIndex } from "../../../../../themes/mixins"
import { FavoriteStar, FavoriteHeart } from "../../../../molecules"
import { usePrevious } from "../../../../../hooks"
import { EndIconsContainer, RecentListContainer, ControlCollapsed } from "./styles"

const Container = styled(motion.div)`
  position: fixed;
  display: grid;
  grid-template-columns: min-content 1fr 30px;
  grid-template-rows: 1fr;

  background-color: #fff;
  filter: drop-shadow(${dropShadow.primary})
    drop-shadow(${dropShadow.secondary});
  border-radius: ${space[1]}px;

  width: calc(100vw - ${space[3]}px);

  bottom: ${space[2]}px;
  left: ${space[2]}px;
  overflow: hidden;
`

const TextContainer = styled(motion.div)`
  font-weight: 500;
  font-size: ${themifyFontSize(2)};
  color: ${COLORS.textColor};
  font-family: inherit;
`

const Flex = styled.div`
  display: flex;
  flex-grow: 1;
  align-self: "center";
`

const IconContainer = styled(motion.div)`
  right: ${space[1]}px;
  cursor: pointer;
  z-index: ${themifyZIndex("hoverOverlay")};
`

const ListItemContainer = styled(motion.div)`
  bottom: 12px;
  right: ${space[2]}px;
  font-size: ${themifyFontSize(3)};
  font-weight: 300;
  color: #fff;
  border-radius: ${space[1]}px;
  padding: 1px 12px;
  background-color: ${chroma(COLORS.primary)};
  border: 1px solid ${chroma(COLORS.primary).darken()};

  align-self: center;
  cursor: pointer;
  margin-left: ${space[2]}px;

  white-space: nowrap;
`

export default function FavoritesList({ state, localStorageValues }) {
  const { favoritePersons } = localStorageValues
  const prevLocalStorageValues = usePrevious(localStorageValues)
  const [isPersonsActive, setIsPersonsActive] = useState(true)
  const [isMoviesActive, setIsMoviesActive] = useState(true)

  const [favoritesCombined, setFavoriteCombined] = useState(undefined)
  useEffect(() => {
    if (!favoritesCombined) {
      setFavoriteCombined(
        [...favoritePersons].sort((a, b) => new Date(b.date) - new Date(a.date))
      )
    }
    if (
      prevLocalStorageValues &&
      !_.isEqual(favoritePersons, prevLocalStorageValues.favoritePersons)
    ) {
      setFavoriteCombined(
        [...favoritePersons].sort((a, b) => new Date(b.date) - new Date(a.date))
      )
    }
  }, [favoritesCombined, favoritePersons, prevLocalStorageValues])

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
          {/* <motion.div
            style={{ display: "inline-block" }}
            whileHover={{ scale: 1.3 }}
          >
            <IoMdInformationCircle
              size={18}
              color={COLORS.textColor}
              style={{ transform: "translate(1px, 3px)" }}
            />
          </motion.div> */}
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
                color={COLORS.primary}
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
                color={COLORS.secondary}
                isActive={isMoviesActive}
              />
            </motion.div>
          </Flex>
        </Flex>
      </ControlCollapsed>
      <RecentListContainer>
        {favoritesCombined &&
          (!favoritesCombined.length ? (
            <TextContainer style={{ fontWeight: 300, alignSelf: "center" }}>
              Mark a movie/series or person as a favorite to display them here!
            </TextContainer>
          ) : (
            favoritesCombined
              .filter((d, i) => i < 10)
              .map(favorite => (
                <ListItemContainer key={favorite.id}>
                  {favorite.name}
                </ListItemContainer>
              ))
          ))}
      </RecentListContainer>
      <EndIconsContainer>
        <IconContainer whileHover={{ scale: 1.3 }}>
          <FaExpandArrowsAlt size={16} color={COLORS.textColor} />
        </IconContainer>
        <IconContainer
          whileHover={{ scale: 1.3 }}
          initial={{ rotate: 0 }}
          animate={{
            rotate: 180,
          }}
        >
          <IoIosArrowForward size={24} color={COLORS.textColor} />
        </IconContainer>
      </EndIconsContainer>
    </Container>
  )
}
