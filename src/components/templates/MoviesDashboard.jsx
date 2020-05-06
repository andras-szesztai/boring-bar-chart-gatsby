import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import {
  IoIosSearch,
  IoIosClose,
  IoIosArrowUp,
  IoIosUnlock,
  IoIosLock,
  IoIosStar,
  IoIosStarOutline,
} from "react-icons/io"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import Reward from "react-rewards"

import { useDeviceType, usePrevious, useLocalStorage } from "../../hooks"
import { FlexContainer } from "../atoms"
import { useDebouncedSearch } from "../../hooks"
import { space, fontFamily, dropShadow } from "../../themes/theme"
import {
  themifyFontSize,
  themifyZIndex,
  themifyColor,
} from "../../themes/mixins"
import { API_ROOT, IMAGE_ROOT, COLORS } from "../../constants/moviesDashboard"
import { SearchBar, Image } from "../organisms/templateElemets/moviesDashboard"
import { moviesDashboardReducer } from "../../reducers"

const CARD_WIDTH = 400
const CARD_HEIGHT = 240

const transition = {
  primary: {
    type: "spring",
    damping: 12,
  },
}

const variants = {
  initial: {
    y: "-100%",
  },
  animateFirst: {
    y: space[2],
    transition: transition.primary,
  },
  animateOpen: {
    y: space[2],
    transition: transition.primary,
  },
  animateClose: {
    y: -(CARD_HEIGHT * 0.75),
    transition: transition.primary,
  },
  exit: {
    y: "-100%",
  },
}

const opacityVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}

const PersonDetailsCard = styled(motion.div)`
  position: fixed;

  background-color: #fff;
  filter: drop-shadow(${dropShadow.primary})
    drop-shadow(${dropShadow.secondary});
  border-radius: ${space[1]}px;

  right: ${space[2]}px;
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
`

const DetailCardContent = styled.div`
  position: relative;

  display: flex;
  justify-content: center;

  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
`

const IconContainer = styled(motion.div)`
  position: absolute;
  left: ${space[2]}px;
  cursor: pointer;
`

const ClosedNameContainer = styled(motion.div)`
  position: absolute;
  bottom: 12px;
  right: ${space[2]}px;
  font-size: ${themifyFontSize(3)};
  font-weight: 200;
  color: #fff;
  border-radius: ${space[1]}px;
  padding: 1px 12px;
  background-color: ${chroma(COLORS.primary)};
  border: 1px solid ${chroma(COLORS.primary).darken()};

  display: flex;
  cursor: pointer;
`

const CardGrid = styled(motion.div)`
  display: flex;
  justify-content: space-between;

  padding: ${space[2]}px;

  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT - 40}px;
`

const CardTextGrid = styled(motion.div)`
  display: grid;
  grid-template-rows: min-content 1fr;

  .name {
    display: flex;
    font-size: ${themifyFontSize(2)};
    font-weight: 500;
    color: ${COLORS.primary};
    cursor: pointer;
  }

  .bio {
    margin-top: ${space[1]}px;
    padding: ${space[1]}px ${space[2]}px;
    font-size: ${themifyFontSize(1)};
    justify-self: stretch;
    width: 250px;
    border-radius: 2px;
    font-weight: 200;
    color: ${themifyColor("grayDarker")};
    font-weight: 300;
    overflow-y: auto;
    box-shadow: inset 1px 1px 5px #d9d9d9, inset -1px -1px 10px #ffffff;
  }
`

let animateCard

export default function MoviesDashboard() {
  const device = useDeviceType()

  const rewardRef = useRef()
  const { state, prevState, actions } = moviesDashboardReducer()
  const { dataSets } = state

  const [isClosed, setIsClosed] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  const [favorites, setFavorites] = useLocalStorage("favorites", [])
  console.log("MoviesDashboard -> favorites", favorites)

  // birthday: "1963-12-18"
  // "place_of_birth"
  // deathday:
  // known_for_department: "Acting"
  // profile_path: "/tJiSUYst4ddIaz1zge2LqCtu9tw.jpg"
  // biography

  if (!isClosed) animateCard = "animateOpen"
  if (isClosed) animateCard = "animateClose"

  if (
    prevState &&
    prevState.dataSets.personDetails &&
    prevState.dataSets.personDetails.name !== dataSets.personDetails.name
  ) {
    if (!isLocked) {
      animateCard = "animateFirst"
      isClosed && setIsClosed(false)
    }
  }

  const animateProps = {
    initial: "initial",
    animate: "animate",
    exit: "exit",
  }

  const LockIcon = isLocked ? IoIosLock : IoIosUnlock
  const isFavorited =
    favorites &&
    dataSets.personDetails &&
    favorites.includes(dataSets.personDetails.id)
  const FavoriteIcon = isFavorited ? IoIosStar : IoIosStarOutline

  return (
    <>
      <Helmet title="Dashboard under construction" />
      {device === "desktop" && (
        <div style={{ userSelect: "none" }}>
          <SearchBar setActiveNameID={actions.setActiveNameID} />
          <AnimatePresence>
            {dataSets.personDetails && (
              <PersonDetailsCard
                initial="initial"
                animate={animateCard}
                exit="exit"
                variants={variants}
              >
                <DetailCardContent>
                  <AnimatePresence>
                    {isClosed && (
                      <IconContainer
                        key="lock"
                        variants={opacityVariant}
                        {...animateProps}
                        whileHover={{ scale: 1.3 }}
                        onClick={() => setIsLocked(prev => !prev)}
                        style={{
                          bottom: space[4],
                        }}
                      >
                        <LockIcon size="24" color={COLORS.primary} />
                      </IconContainer>
                    )}
                  </AnimatePresence>
                  <IconContainer
                    key="arrow"
                    style={{
                      bottom: space[1],
                    }}
                    role="button"
                    onClick={() => {
                      setIsClosed(prev => !prev)
                      isLocked && setIsLocked(false)
                    }}
                    animate={{
                      rotate: isClosed ? 180 : 0,
                    }}
                    whileHover={{ scale: 1.3 }}
                  >
                    <IoIosArrowUp size="24" color={COLORS.primary} />
                  </IconContainer>
                  <AnimatePresence>
                    {isClosed && (
                      <ClosedNameContainer
                        key="close-name"
                        variants={opacityVariant}
                        onClick={() => {
                          !isFavorited && rewardRef.current.rewardMe()
                          if (isFavorited) {
                            setFavorites(
                              favorites.filter(
                                id => +id !== +dataSets.personDetails.id
                              )
                            )
                          } else {
                            setFavorites([
                              ...favorites,
                              dataSets.personDetails.id,
                            ])
                          }
                        }}
                        {...animateProps}
                      >
                        {dataSets.personDetails.name}
                        <div
                          style={{
                            marginLeft: 10,
                            transform: "translateY(2px)",
                          }}
                        >
                          <Reward
                            ref={rewardRef}
                            type="confetti"
                            config={{
                              lifetime: 90,
                              angle: 90,
                              decay: 0.9,
                              spread: 150,
                              startVelocity: 8,
                              elementCountelementCount: 65,
                              elementSize: 5,
                              springAnimation: false,
                              colors: Object.values(COLORS),
                            }}
                          >
                            <FavoriteIcon size={22} color={COLORS.favorite} />
                          </Reward>
                        </div>
                      </ClosedNameContainer>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {!isClosed && (
                      <CardGrid
                        key="content"
                        variants={opacityVariant}
                        {...animateProps}
                      >
                        <CardTextGrid>
                          <div
                            className="name"
                            onClick={() => {
                              !isFavorited && rewardRef.current.rewardMe()
                              if (isFavorited) {
                                setFavorites(
                                  favorites.filter(
                                    id => +id !== +dataSets.personDetails.id
                                  )
                                )
                              } else {
                                setFavorites([
                                  ...favorites,
                                  dataSets.personDetails.id,
                                ])
                              }
                            }}
                          >
                            {dataSets.personDetails.name}
                            <div
                              style={{
                                marginLeft: 6,
                                transform: "translateY(2px)",
                              }}
                            >
                              <Reward
                                ref={rewardRef}
                                type="confetti"
                                config={{
                                  lifetime: 90,
                                  angle: 90,
                                  decay: 0.9,
                                  spread: 150,
                                  startVelocity: 8,
                                  elementCountelementCount: 65,
                                  elementSize: 5,
                                  springAnimation: false,
                                  colors: Object.values(COLORS),
                                }}
                              >
                                <FavoriteIcon
                                  size={18}
                                  color={COLORS.favorite}
                                />
                              </Reward>
                            </div>
                          </div>
                          <div className="bio">
                            {dataSets.personDetails.biography}
                          </div>
                        </CardTextGrid>
                        <Image
                          url={dataSets.personDetails.profile_path}
                          height={168}
                          alt={dataSets.personDetails.name}
                        />
                      </CardGrid>
                    )}
                  </AnimatePresence>
                </DetailCardContent>
              </PersonDetailsCard>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}
