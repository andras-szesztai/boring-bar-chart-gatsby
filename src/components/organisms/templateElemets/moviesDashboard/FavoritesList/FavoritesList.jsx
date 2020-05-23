import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import _ from "lodash"
import { useMeasure } from "react-use"
import { IoMdInformationCircle, IoIosArrowForward } from "react-icons/io"
import { FaExpandArrowsAlt } from "react-icons/fa"
import useResizeAware from "react-resize-aware"

import { space, dropShadow, colors } from "../../../../../themes/theme"
import { COLORS, TRANSITION } from "../../../../../constants/moviesDashboard"
import { themifyFontSize, themifyZIndex } from "../../../../../themes/mixins"
import { FavoriteStar, FavoriteHeart } from "../../../../molecules"
import { usePrevious } from "../../../../../hooks"
import {
  EndIconsContainer,
  RecentListContainer,
  ControlCollapsed,
  HiddenRecentListContainer,
} from "./styles"
import { useSpring } from "react-spring"

const Container = styled(motion.div)`
  position: fixed;
  display: grid;
  grid-template-columns: min-content 1fr 35px;
  grid-template-rows: 1fr;

  background-color: #fff;
  filter: drop-shadow(${dropShadow.primary});
  border: 1px solid ${colors.whiteDark};
  border-radius: ${space[1]}px;

  width: calc(100vw - ${space[3]}px);
  height: 90px;

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

const CONTROL_WIDTH = 200

export default function FavoritesList({ state, localStorageValues }) {
  const { favoritePersons } = localStorageValues
  const prevLocalStorageValues = usePrevious(localStorageValues)
  const [isPersonsActive, setIsPersonsActive] = useState(true)
  const [isMoviesActive, setIsMoviesActive] = useState(true)
  const [resizeListener, sizes] = useResizeAware()

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

  const [isOpen, setIsOpen] = useState(true)
  const [listRef, dims] = useMeasure()

  console.log(dims)
  return (
    <>
      <HiddenRecentListContainer ref={listRef}>
        {favoritesCombined &&
          (!favoritesCombined.length ? (
            <TextContainer style={{ fontWeight: 300, alignSelf: "center" }}>
              Mark a movie/series or person as a favorite to display them here!
            </TextContainer>
          ) : (
            favoritesCombined
              .filter((d, i) => i < 10)
              .map(favorite => (
                <AnimatePresence key={favorite.name}>
                  <ListItemContainer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 1 } }}
                    // leave={{ opacity: 0, transition: { delay: 1 } }}
                    key={favorite.id}
                  >
                    {favorite.name}
                  </ListItemContainer>
                </AnimatePresence>
              ))
          ))}
      </HiddenRecentListContainer>

      <Container
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          width: dims.width + 245,
        }}
        transition={{
          duration: 1,
          type: "tween",
          ease: [0.65, 0, 0.35, 1],
        }}
      >
        <ControlCollapsed
          animate={{
            boxShadow: "none",
          }}
        >
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
        </ControlCollapsed>

        {/* <RecentListContainer ref={listRef}>
          {favoritesCombined &&
            (!favoritesCombined.length ? (
              <TextContainer style={{ fontWeight: 300, alignSelf: "center" }}>
                Mark a movie/series or person as a favorite to display them
                here!
              </TextContainer>
            ) : (
              favoritesCombined
                .filter((d, i) => i < 10)
                .map(favorite => (
                  <AnimatePresence key={favorite.name}>
                    <ListItemContainer
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 1 } }}
                      // leave={{ opacity: 0, transition: { delay: 1 } }}
                      key={favorite.id}
                    >
                      {favorite.name}
                    </ListItemContainer>
                  </AnimatePresence>
                ))
            ))}
        </RecentListContainer> */}

        <EndIconsContainer
          animate={{
            boxShadow: "none",
          }}
        >
          <IconContainer whileHover={{ scale: 1.3 }}>
            <FaExpandArrowsAlt size={16} color={COLORS.textColor} />
          </IconContainer>
          <IconContainer
            onClick={() => setIsOpen(prev => !prev)}
            whileHover={{
              scale: 1.3,
              transition: {
                delay: 0,
              },
            }}
            initial={{ rotate: isOpen ? 180 : 0 }}
            animate={{
              rotate: isOpen ? 180 : 0,
              transition: {
                delay: 1,
              },
            }}
          >
            <IoIosArrowForward size={24} color={COLORS.textColor} />
          </IconContainer>
        </EndIconsContainer>
      </Container>
    </>
  )
}
