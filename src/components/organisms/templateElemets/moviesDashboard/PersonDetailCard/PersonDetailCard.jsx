import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import styled from "styled-components"
import { IoIosArrowUp, IoIosUnlock, IoIosLock } from "react-icons/io"

import { dropShadow, space } from "../../../../../themes/theme"
import { useLocalStorage } from "../../../../../hooks"
import {
  OPACITY_VARIANT,
  ANIMATE_PROPS,
  COLORS,
  TRANSITION,
  LOCAL_STORE_ACCESSORS,
} from "../../../../../constants/moviesDashboard"
import ClosedNameContainer from "../ClosedNameContainer/ClosedNameContainer"
import Image from "../Image/Image"
import { TextContainer, TitleContainer } from "../styles/styles"
import FavoriteStar from "../Icons/FavoriteStar"

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

export default function PersonDetailCard({ state, prevState, actions }) {
  const {
    dataSets,
    personDetailsCard: { isOpen },
  } = state
  const { openPersonDetails, closePersonDetails } = actions

  const [isLocked, setIsLocked] = useState(false)
  const [isTitleHovered, setIsTitleHovered] = useState(false)

  const [favoritePersons, setFavoritePersons] = useLocalStorage(
    LOCAL_STORE_ACCESSORS.favoritePersons,
    []
  )

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
    { id: dataSets.personDetails.id, name: dataSets.personDetails.name },
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
          <DetailCardContent>
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
              animate={{
                rotate: !isOpen ? 180 : 0,
              }}
              whileHover={{ scale: 1.3 }}
            >
              <IoIosArrowUp size="24" color={COLORS.primary} />
            </IconContainer>
            <AnimatePresence>
              {!isOpen && (
                <ClosedNameContainer
                  dataSets={dataSets}
                  setFavorites={() =>
                    setFavoritePersons(isFavorited ? filterOut() : filterIn())
                  }
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
                          marginLeft: 8,
                          position: 'absolute',
                          right: 0,
                          top: 0
                        }}
                        animate={{
                          scale: isTitleHovered ? 1.3 : 1
                        }}
                      >
                        <FavoriteStar isFavorited={isFavorited} />
                      </motion.div>
                    </TitleContainer>
                    <TextContainer>
                      {dataSets.personDetails.biography}
                    </TextContainer>
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
  )
}
