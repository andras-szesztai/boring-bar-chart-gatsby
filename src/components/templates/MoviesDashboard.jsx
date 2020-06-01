import React, { useState, useEffect, useRef } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import styled, { css } from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import _ from "lodash"
import { useUpdateEffect } from "react-use"
import isEqual from "lodash/isEqual"
import { scaleTime, scaleSqrt } from "d3-scale"
import { extent } from "d3-array"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"

import { useDeviceType, usePrevious, useStateWithPrevious } from "../../hooks"
import {
  SearchBar,
  PersonDetailCard,
  FavoritesList,
  MovieSelectorChart,
} from "../organisms/templateElemets/moviesDashboard"
import { moviesDashboardReducer } from "../../reducers"
import { dropShadow, space } from "../../themes/theme"
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  COLORS,
  TRANSITION,
} from "../../constants/moviesDashboard"
import { themifyZIndex } from "../../themes/mixins"

const handleSize = space[6]

const MovieDetailsCardStyle = css`
  position: fixed;
  background-color: #fff;
  filter: drop-shadow(${dropShadow.primary})
    drop-shadow(${dropShadow.secondary});
  border-radius: ${space[1]}px;
  top: calc(50% - ${CARD_HEIGHT.movie / 2}px);
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT.movie}px;
  z-index: 4;
`

const HandleStyle = css`
  content: "";
  position: absolute;
  z-index: 4;
  bottom: 0px;
  width: ${handleSize}px;
  height: ${handleSize}px;
  background-color: #fff;
  border-radius: ${space[1]}px 0 0 ${space[1]}px;
`

const MovieDetailsCardRight = styled(motion.div)`
  ${MovieDetailsCardStyle}
  right: ${space[2]}px;
  :after {
    ${HandleStyle}
    left: -${handleSize - 4}px;
  }
`

const MovieDetailsCardLeft = styled(motion.div)`
  ${MovieDetailsCardStyle}
  left: ${space[2]}px;
  :after {
    ${HandleStyle}
    right: ${-handleSize + 4}px;
  }
`

const IconContainerStyle = css`
  position: relative;
  cursor: pointer;
  z-index: 4;
  top: ${CARD_HEIGHT.movie - handleSize}px;
  width: ${handleSize}px;
  height: ${handleSize}px;
  z-index: ${themifyZIndex("hoverOverlay")};

  display: flex;
  justify-content: center;
  align-items: center;
`

const IconContainerRight = styled(motion.div)`
  ${IconContainerStyle}
  left: -${handleSize - 4}px;
`

const IconContainerLeft = styled(motion.div)`
  ${IconContainerStyle}
  left: ${CARD_WIDTH - 4}px;
`

export default function MoviesDashboard() {
  const device = useDeviceType()

  const {
    state,
    prevState,
    actions,
    localStorageValues,
    localStorageSetters,
  } = moviesDashboardReducer()
  const { favoritePersons } = localStorageValues
  const { setFavoritePersons } = localStorageSetters
  const { dataSets, activeNameID, activeMovie } = state
  const { setActiveMovie } = actions

  useEffect(() => {
    favoritePersons &&
      favoritePersons.length &&
      actions.setActiveNameID(_.last(favoritePersons).id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rightVariants = {
    initial: {
      x: CARD_WIDTH + handleSize,
    },
    animateFirst: {
      x: 0,
      transition: {
        ...TRANSITION.primary,
        delay:
          prevState && typeof prevState.activeMovie.position == "number"
            ? 0.25
            : 0,
      },
    },
    animateOpen: {
      x: 0,
      transition: TRANSITION.primary,
    },
    animateClose: {
      x: CARD_WIDTH + handleSize,
      transition: TRANSITION.primary,
    },
    exit: {
      x: CARD_WIDTH + handleSize,
    },
  }

  const leftVariants = {
    initial: {
      x: -(CARD_WIDTH + handleSize),
    },
    animateFirst: {
      x: 0,
      transition: {
        ...TRANSITION.primary,
        delay:
          prevState && typeof prevState.activeMovie.position == "number"
            ? 0.25
            : 0,
      },
    },
    animateOpen: {
      x: 0,
      transition: TRANSITION.primary,
    },
    animateClose: {
      x: -(CARD_WIDTH + handleSize),
      transition: TRANSITION.primary,
    },
    exit: {
      x: -(CARD_WIDTH + handleSize),
    },
  }

  const [
    isMovieDetailsCardOpen,
    setIsMovieDetailsCardOpen,
    prevIsMovieDetailsCardOpen,
  ] = useStateWithPrevious(true)

  const [accessor, setAcessor] = useState("animateFirst")

  useEffect(() => {
    if (prevState) {
      if (isMovieDetailsCardOpen !== prevIsMovieDetailsCardOpen) {
        setAcessor(isMovieDetailsCardOpen ? "animateOpen" : "animateClose")
      }
      if (activeMovie.id !== prevState.activeMovie.id) {
        setAcessor("animateFirst")
        setIsMovieDetailsCardOpen(true)
      }
    }
  }, [
    prevIsMovieDetailsCardOpen,
    isMovieDetailsCardOpen,
    prevState,
    activeMovie,
    setIsMovieDetailsCardOpen,
  ])

  return (
    <>
      <Helmet title="Dashboard under construction" />
      {device === "desktop" && (
        <div style={{ userSelect: "none" }}>
          <SearchBar setActiveNameID={actions.setActiveNameID} />
          <PersonDetailCard
            state={state}
            prevState={prevState}
            actions={actions}
            loading={state.loading.personDetails}
            favoritePersons={favoritePersons}
            setFavoritePersons={setFavoritePersons}
          />
          <FavoritesList
            state={state}
            actions={actions}
            localStorageValues={localStorageValues}
            localStorageSetters={localStorageSetters}
          />
          <MovieSelectorChart
            activeNameID={activeNameID}
            loading={state.loading}
            dataSets={dataSets}
            setActiveMovie={setActiveMovie}
            activeMovie={activeMovie}
          />

          <AnimatePresence>
            {activeMovie.position === 0 && (
              <MovieDetailsCardRight
                initial="initial"
                animate={accessor}
                exit="exit"
                variants={rightVariants}
              >
                <IconContainerRight
                  role="button"
                  onClick={() => setIsMovieDetailsCardOpen(prev => !prev)}
                  // onClick={() =>
                  //   setActiveMovie({
                  //     activeMovie: {
                  //       id: undefined,
                  //       data: {},
                  //       position: undefined,
                  //     },
                  //   })
                  // }
                  whileHover={{
                    scale: 1.3,
                    transition: {
                      delay: 0,
                    },
                  }}
                  initial={{ rotate: 180 }}
                  // animate={{
                  //   rotate: isOpen ? 180 : 0,
                  //   transition: {
                  //     delay: 1,
                  //   },
                  // }}
                >
                  <IoIosArrowBack size={24} color={COLORS.secondaryDark} />
                </IconContainerRight>
              </MovieDetailsCardRight>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeMovie.position === 1 && (
              <MovieDetailsCardLeft
                initial="initial"
                animate={accessor}
                exit="exit"
                variants={leftVariants}
              >
                <IconContainerLeft
                  role="button"
                  onClick={() => setIsMovieDetailsCardOpen(prev => !prev)}
                  // onClick={() => setIsOpen(prev => !prev)}
                  whileHover={{
                    scale: 1.3,
                    transition: {
                      delay: 0,
                    },
                  }}
                  initial={{ rotate: 180 }}
                  // animate={{
                  //   rotate: isOpen ? 180 : 0,
                  //   transition: {
                  //     delay: 1,
                  //   },
                  // }}
                >
                  <IoIosArrowForward size={24} color={COLORS.secondaryDark} />
                </IconContainerLeft>
              </MovieDetailsCardLeft>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}
