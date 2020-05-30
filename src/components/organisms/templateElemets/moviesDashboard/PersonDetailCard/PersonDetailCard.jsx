import React, { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import styled from "styled-components"
import { IoIosArrowUp, IoIosUnlock, IoIosLock } from "react-icons/io"
import _ from "lodash"

import ClosedNameContainer from "../ClosedNameContainer/ClosedNameContainer"
import Image from "../Image/Image"
import { FavoriteStar } from "../../../../molecules"
import ContentLoader from "./ContentLoader"

import { dropShadow, space } from "../../../../../themes/theme"
import { usePrevious, useLocalStorage } from "../../../../../hooks"
import {
  OPACITY_VARIANT,
  ANIMATE_PROPS,
  COLORS,
  TRANSITION,
  LOCAL_STORE_ACCESSORS,
} from "../../../../../constants/moviesDashboard"
import { TextContainer, TitleContainer } from "../styles/styles"
import { themifyZIndex } from "../../../../../themes/mixins"

const CARD_WIDTH = 400
const CARD_HEIGHT = 240

const variants = {
  initial: {
    y: "-100%",
  },
  animateFirst: {
    y: space[2],
    transition: TRANSITION.primary,
  },
  animateOpen: {
    y: space[2],
    transition: TRANSITION.primary,
  },
  animateClose: {
    y: -(CARD_HEIGHT * 0.75),
    transition: TRANSITION.primary,
  },
  exit: {
    y: "-100%",
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
  z-index: 5;
`

const DetailCardContent = styled(motion.div)`
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
  z-index: ${themifyZIndex("hoverOverlay")};
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
`

let animateCard

export default function PersonDetailCard({
  state,
  prevState,
  actions,
  loading,
  favoritePersons,
  setFavoritePersons,
}) {
  const prevLoading = usePrevious(loading)
  const {
    dataSets,
    personDetailsCard: { isOpen },
  } = state
  const { openPersonDetails, closePersonDetails } = actions

  const [isInitialized, setIsInitialized] = useState(false)
  useEffect(() => {
    if (!isInitialized && prevLoading && !loading) {
      setIsInitialized(true)
    }
  }, [isInitialized, prevLoading, loading])

  const [isLocked, setIsLocked] = useState(undefined)
  const [isLockedInLocalStorage, setLockedInLocalStorage] = useLocalStorage(
    LOCAL_STORE_ACCESSORS.lockedPersonDetailCard,
    []
  )
  useEffect(() => {
    if (!isInitialized && typeof isLocked == "undefined") {
      const isLocalSet = typeof isLockedInLocalStorage == "boolean"
      setIsLocked(isLocalSet ? isLockedInLocalStorage : false)
      isLocalSet && isLockedInLocalStorage
        ? closePersonDetails()
        : openPersonDetails()
    }
    if (typeof isLocked != "undefined" && isLocked !== isLockedInLocalStorage) {
      setLockedInLocalStorage(isLocked)
    }
  }, [
    isInitialized,
    isLockedInLocalStorage,
    isLocked,
    setLockedInLocalStorage,
    closePersonDetails,
    openPersonDetails,
  ])

  const [isTitleHovered, setIsTitleHovered] = useState(false)

  if (isOpen) animateCard = "animateOpen"
  if (!isOpen) animateCard = "animateClose"

  if (
    prevState &&
    prevState.dataSets.personDetails &&
    prevState.dataSets.personDetails.name !== dataSets.personDetails.name
  ) {
    if (!isLocked) {
      animateCard = "animateFirst"
      !isOpen && openPersonDetails()
    }
  }

  const isFavorited =
    favoritePersons &&
    dataSets.personDetails &&
    !!favoritePersons.find(fav => fav && fav.id === dataSets.personDetails.id)

  const LockIcon = isLocked ? IoIosLock : IoIosUnlock

  const filterOut = () =>
    favoritePersons.filter(({ id }) => +id !== +dataSets.personDetails.id)
  const filterIn = () => [
    ...favoritePersons,
    {
      id: dataSets.personDetails.id,
      name: dataSets.personDetails.name,
      date: new Date(),
      credits: _.uniq(
        [dataSets.personCredits.cast, dataSets.personCredits.crew]
          .flat()
          .map(credit => credit && credit.id)
      ),
    },
  ]

  return (
    <AnimatePresence>
      {dataSets.personDetails && (
        <PersonDetailsCard
          initial="initial"
          animate={animateCard}
          exit="exit"
          variants={variants}
        >
          <AnimatePresence>
            {!isOpen && (
              <IconContainer
                key="lock"
                variants={OPACITY_VARIANT}
                {...ANIMATE_PROPS}
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
              isOpen ? closePersonDetails() : openPersonDetails()
              isLocked && setIsLocked(false)
            }}
            initial={{ rotate: !isOpen ? 180 : 0 }}
            animate={{
              rotate: !isOpen ? 180 : 0,
              transition: {
                delay: 1,
              },
            }}
            whileHover={{ scale: 1.3 }}
          >
            <IoIosArrowUp size="24" color={COLORS.primary} />
          </IconContainer>
          <AnimatePresence>
            {loading || !isInitialized ? (
              <ContentLoader isOpen={isOpen} />
            ) : (
              <DetailCardContent variants={OPACITY_VARIANT} {...ANIMATE_PROPS}>
                <AnimatePresence>
                  {!isOpen && (
                    <ClosedNameContainer
                      dataSets={dataSets}
                      setFavorites={() => {
                        setFavoritePersons(
                          isFavorited ? filterOut() : filterIn()
                        )
                      }}
                      isFavorited={isFavorited}
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {isOpen && (
                    <CardGrid
                      key="content"
                      variants={OPACITY_VARIANT}
                      {...ANIMATE_PROPS}
                    >
                      <CardTextGrid>
                        <TitleContainer
                          onClick={() => {
                            setFavoritePersons(
                              isFavorited ? filterOut() : filterIn()
                            )
                          }}
                          onMouseEnter={() => setIsTitleHovered(true)}
                          onMouseLeave={() => setIsTitleHovered(false)}
                        >
                          {dataSets.personDetails.name}
                          <motion.div
                            style={{
                              position: "absolute",
                              right: -3,
                            }}
                            animate={{
                              scale: isTitleHovered ? 1.2 : 1,
                            }}
                          >
                            <FavoriteStar
                              isFavorited={isFavorited}
                              isHovered={isTitleHovered}
                            />
                          </motion.div>
                        </TitleContainer>
                        <TextContainer>
                          {dataSets.personDetails.biography}
                        </TextContainer>
                      </CardTextGrid>
                      <Image
                        url={dataSets.personDetails.profile_path}
                        height={184}
                        alt={dataSets.personDetails.name}
                      />
                    </CardGrid>
                  )}
                </AnimatePresence>
              </DetailCardContent>
            )}
          </AnimatePresence>
        </PersonDetailsCard>
      )}
    </AnimatePresence>
  )
}
