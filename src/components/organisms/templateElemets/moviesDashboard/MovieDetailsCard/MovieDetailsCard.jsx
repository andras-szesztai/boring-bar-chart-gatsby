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
  makeLeftVariants,
} from "./styles"

const ContentGrid = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: grid;
  position: absolute;
  top: 0px;
  grid-template-columns: 3fr 2fr;
  grid-template-rows: 200px repeat(3, 1fr);
  grid-template-areas:
    "info poster"
    "genres poster"
    "score score"
    "link link";
`

const PlaceHolderDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
`

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

  // genre_ids: (3) [28, 80, 53]
  // media_type: "movie"
  // original_language: "en"
  // overview: "On the day of his retirement, a veteran CIA agent learns that his former protégé has been arrested in China, is sentenced to die the next morning in Beijing, and that the CIA is considering letting that happen to avoid an international scandal."
  // poster_path: "/6y8M1rxjKofQCRKKe6xeV91K2Fc.jpg"
  // release_date: "2001-11-18"
  // title: "Spy Game"
  // original_title: "Spy Game"
  // vote_average: 6.9
  // vote_count: 1222

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
            <ContentGrid>
              <PlaceHolderDiv style={{ gridArea: "info" }}>
                Info
              </PlaceHolderDiv>
              <PlaceHolderDiv style={{ gridArea: "poster" }}>
                Image
              </PlaceHolderDiv>
              <PlaceHolderDiv style={{ gridArea: "genres" }}>
                Genres
              </PlaceHolderDiv>
              <PlaceHolderDiv style={{ gridArea: "score" }}>
                Scrore
              </PlaceHolderDiv>
              <PlaceHolderDiv style={{ gridArea: "link" }}>
                Link
              </PlaceHolderDiv>
            </ContentGrid>
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
