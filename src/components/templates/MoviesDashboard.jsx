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
import { IoIosArrowBack, IoIosArrowForward, IoIosClose } from "react-icons/io"

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
  HANDLE_SIZE,
  WHILE_HOVER,
} from "../../constants/moviesDashboard"
import { themifyZIndex } from "../../themes/mixins"

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
  width: ${HANDLE_SIZE}px;
  height: ${HANDLE_SIZE}px;
  background-color: #fff;
  border-radius: ${space[1]}px 0 0 ${space[1]}px;
`

const MovieDetailsCardRight = styled(motion.div)`
  ${MovieDetailsCardStyle}
  right: ${space[2]}px;
  :after {
    ${HandleStyle}
    left: -${HANDLE_SIZE - 4}px;
  }
`

const MovieDetailsCardLeft = styled(motion.div)`
  ${MovieDetailsCardStyle}
  left: ${space[2]}px;
  :after {
    ${HandleStyle}
    right: ${-HANDLE_SIZE + 4}px;
  }
`

const IconContainer = styled(motion.div)`
  position: relative;
  cursor: pointer;
  z-index: 4;
  top: ${CARD_HEIGHT.movie - HANDLE_SIZE}px;
  width: ${HANDLE_SIZE}px;
  height: ${HANDLE_SIZE}px;
  z-index: ${themifyZIndex("hoverOverlay")};

  display: flex;
  justify-content: center;
  align-items: center;
`

const ArrowIconContainerRight = styled(IconContainer)`
  left: -${HANDLE_SIZE - 4}px;
  top: ${CARD_HEIGHT.movie - HANDLE_SIZE * 2}px;
`

const ArrowIconContainerLeft = styled(IconContainer)`
  left: ${CARD_WIDTH - 4}px;
  top: ${CARD_HEIGHT.movie - HANDLE_SIZE * 2}px;
`

const CloseIconContainerRight = styled(IconContainer)`
  top: 0px;
  left: ${CARD_WIDTH - HANDLE_SIZE}px;
`

const CloseIconContainerLeft = styled(IconContainer)`
  top: 0px;
  left: ${CARD_WIDTH - HANDLE_SIZE}px;
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
      x: CARD_WIDTH + HANDLE_SIZE,
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
      x: CARD_WIDTH - HANDLE_SIZE,
      transition: TRANSITION.primary,
    },
    exit: {
      x: CARD_WIDTH + HANDLE_SIZE,
    },
  }

  const leftVariants = {
    initial: {
      x: -(CARD_WIDTH + HANDLE_SIZE),
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
      x: -CARD_WIDTH + HANDLE_SIZE,
      transition: TRANSITION.primary,
    },
    exit: {
      x: -(CARD_WIDTH + HANDLE_SIZE),
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

  const makeCardProps = variants => ({
    initial: "initial",
    animate: accessor,
    exit: "exit",
    variants: variants,
  })

  const arrowContainerProps = {
    role: "button",
    onClick: () => setIsMovieDetailsCardOpen(prev => !prev),
    whileHover: WHILE_HOVER,
    initial: { rotate: 180 },
    animate: {
      rotate: isMovieDetailsCardOpen ? 180 : 0,
      transition: {
        delay: 1,
      },
    },
  }

  const closeContainerProps = {
    whileHover: WHILE_HOVER,
    onClick: () =>
      setActiveMovie({
        activeMovie: {
          id: undefined,
          data: {},
          position: undefined,
        },
      }),
  }

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
              <MovieDetailsCardRight {...makeCardProps(rightVariants)}>
                <CloseIconContainerRight
                  {...closeContainerProps}
                  animate={{
                    x: isMovieDetailsCardOpen ? 0 : -CARD_WIDTH + HANDLE_SIZE,
                    transition: {
                      type: "spring",
                      damping: 16,
                      delay: 0.5,
                    },
                  }}
                >
                  <IoIosClose size={30} color={COLORS.secondaryDark} />
                </CloseIconContainerRight>
                <ArrowIconContainerRight {...arrowContainerProps}>
                  <IoIosArrowBack size={24} color={COLORS.secondaryDark} />
                </ArrowIconContainerRight>
              </MovieDetailsCardRight>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeMovie.position === 1 && (
              <MovieDetailsCardLeft {...makeCardProps(leftVariants)}>
                <CloseIconContainerLeft {...closeContainerProps}>
                  <IoIosClose size={28} color={COLORS.secondaryDark} />
                </CloseIconContainerLeft>
                <ArrowIconContainerLeft {...arrowContainerProps}>
                  <IoIosArrowForward size={24} color={COLORS.secondaryDark} />
                </ArrowIconContainerLeft>
              </MovieDetailsCardLeft>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}
