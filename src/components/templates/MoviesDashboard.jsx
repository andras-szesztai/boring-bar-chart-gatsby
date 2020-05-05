import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { IoIosSearch, IoIosClose, IoIosArrowUp } from "react-icons/io"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"

import { useDeviceType, usePrevious } from "../../hooks"
import { FlexContainer } from "../atoms"
import { useDebouncedSearch } from "../../hooks"
import { space, fontFamily, dropShadow } from "../../themes/theme"
import { themifyFontSize, themifyZIndex } from "../../themes/mixins"
import { API_ROOT, IMAGE_ROOT, COLORS } from "../../constants/moviesDashboard"
import { SearchBar } from "../organisms/templateElemets/moviesDashboard"
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

const nameVariant = {
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
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
`

const IconContainer = styled(motion.div)`
  position: absolute;
  bottom: ${space[1]}px;
  left: ${space[2]}px;
  cursor: pointer;
`

const ClosedNameContainer = styled(motion.div)`
  position: absolute;
  bottom: ${space[2]}px;
  right: ${space[2]}px;
  font-size: ${themifyFontSize(3)};
  color: #fff;
  cursor: pointer;
  border-radius: ${space[1]}px;
  padding: 1px 12px;
  background-color: ${chroma(COLORS.primary)};
`

const CardGrid = styled(motion.div)`
  display: grid;
`

let animateCard

export default function MoviesDashboard() {
  const device = useDeviceType()

  const { state, prevState, actions } = moviesDashboardReducer()
  const { dataSets } = state

  const [isClosed, setIsClosed] = useState(false)

  // birthday: "1963-12-18"
  // deathday:
  // known_for_department: "Acting"
  // name
  // profile_path: "/tJiSUYst4ddIaz1zge2LqCtu9tw.jpg"
  // biography

  if (!isClosed) animateCard = "animateOpen"
  if (isClosed) animateCard = "animateClose"

  if (
    prevState &&
    !prevState.dataSets.personDetails &&
    dataSets.personDetails
  ) {
    animateCard = "animateFirst"
  }

  return (
    <>
      <Helmet title="Dashboard under construction" />
      {device === "desktop" && (
        <>
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
                  <IconContainer
                    role="button"
                    onClick={() => setIsClosed(prev => !prev)}
                    animate={{
                      rotate: isClosed ? 180 : 0,
                    }}
                    whileHover={{ scale: 1.3 }}
                  >
                    <IoIosArrowUp size="24" color={COLORS.primary} />
                  </IconContainer>
                  {isClosed ? (
                    <ClosedNameContainer
                      variants={nameVariant}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {dataSets.personDetails.name}
                    </ClosedNameContainer>
                  ) : (
                    <CardGrid
                      variants={nameVariant}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      Hello{" "}
                    </CardGrid>
                  )}
                </DetailCardContent>
              </PersonDetailsCard>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  )
}
