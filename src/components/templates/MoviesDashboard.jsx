import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled from "styled-components"
import { IoIosSearch, IoIosClose, IoIosArrowForward } from "react-icons/io"
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
    y: 10,
    transition: transition.primary,
  },
  animateOpen: {
    x: 0,
    transition: transition.primary,
  },
  animateClose: {
    x: CARD_WIDTH * .9,
    transition: transition.primary,
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
  height: 250px;
`

const DetailCardContent = styled.div`
  position: relative;
`

const IconContainer = styled(motion.div)`
  position: absolute;
  top: ${space[2]}px;
  left: ${space[1]}px;
  cursor: pointer;
`

let animateCard

export default function MoviesDashboard() {
  const device = useDeviceType()

  const { state, prevState, actions } = moviesDashboardReducer()
  const { dataSets } = state

  const [isClosed, setIsClosed] = useState(false)

  // birthday: "1963-12-18"
  // deathday: null
  // known_for_department: "Acting"
  // name: "Brad Pitt"
  // profile_path: "/tJiSUYst4ddIaz1zge2LqCtu9tw.jpg"
  // biography

  if(!isClosed) animateCard = "animateOpen"
  if(isClosed) animateCard = "animateClose"

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
                  >
                    <IoIosArrowForward size="24" color={COLORS.primary} />
                  </IconContainer>
                </DetailCardContent>
              </PersonDetailsCard>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  )
}
