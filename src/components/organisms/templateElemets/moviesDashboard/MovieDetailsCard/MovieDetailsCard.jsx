import React from "react"
import styled, { css } from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import { IoIosArrowBack, IoIosArrowForward, IoIosClose } from "react-icons/io"

import {
  CARD_WIDTH,
  HANDLE_SIZE,
  TRANSITION,
  WHILE_HOVER,
  COLORS,
} from "../../../../../constants/moviesDashboard"
import { useAnimationAccessor } from "./hooks"
import {
  MovieDetailsCardRight,
  CloseIconContainer,
  ArrowIconContainerRight,
  MovieDetailsCardLeft,
  ArrowIconContainerLeft,
  makeRightVariants,
  makeLeftVariants
} from "./styles"

export default function MovieDetailsCardComponent({
  activeMovie,
  prevActiveMovie,
  setActiveMovie,
}) {
  const delay = typeof prevActiveMovie.position == "number" ? 0.25 : 0
  
  const {
    accessor,
    isMovieDetailsCardOpen,
    setIsMovieDetailsCardOpen,
  } = useAnimationAccessor({ prevActiveMovie, activeMovie })

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
      <AnimatePresence>
        {activeMovie.position === 0 && (
          <MovieDetailsCardRight {...makeCardProps(makeRightVariants(delay))}>
            <CloseIconContainer
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
            </CloseIconContainer>
            <ArrowIconContainerRight {...arrowContainerProps}>
              <IoIosArrowBack size={24} color={COLORS.secondaryDark} />
            </ArrowIconContainerRight>
          </MovieDetailsCardRight>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeMovie.position === 1 && (
          <MovieDetailsCardLeft {...makeCardProps(makeLeftVariants(delay))}>
            <CloseIconContainer {...closeContainerProps}>
              <IoIosClose size={28} color={COLORS.secondaryDark} />
            </CloseIconContainer>
            <ArrowIconContainerLeft {...arrowContainerProps}>
              <IoIosArrowForward size={24} color={COLORS.secondaryDark} />
            </ArrowIconContainerLeft>
          </MovieDetailsCardLeft>
        )}
      </AnimatePresence>
    </>
  )
}
