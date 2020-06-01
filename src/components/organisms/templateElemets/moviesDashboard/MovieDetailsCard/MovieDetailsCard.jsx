import React from "react"
import styled, { css } from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosClose,
  IoIosCloseCircle,
} from "react-icons/io"
import ClampLines from "react-clamp-lines"
import LinesEllipsis from 'react-lines-ellipsis'

import {
  CARD_WIDTH,
  HANDLE_SIZE,
  WHILE_HOVER,
  COLORS,
} from "../../../../../constants/moviesDashboard"
import { useAnimationAccessor } from "./hooks"
import {
  MovieDetailsCardRight,
  CloseIconContainerLeft,
  CloseIconContainerRight,
  ArrowIconContainerRight,
  MovieDetailsCardLeft,
  ArrowIconContainerLeft,
  makeRightVariants,
  makeLeftVariants,
} from "./styles"
import Image from "../Image/Image"
import { TitleContainer } from "../styles/styles"
import { space } from "../../../../../themes/theme"
import { FavoriteStar } from "../../../../molecules"

const ContentGrid = styled(motion.div)`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0px;
  padding: ${space[3]}px;

  display: grid;
  grid-template-columns: 1fr 160px;
  grid-column-gap: ${space[3]}px;
  grid-template-rows: 240px 60px 1fr ${HANDLE_SIZE}px;
  grid-template-areas:
    "info poster"
    "genres genres"
    "score score"
    "link link";
`

const MainInfoContainer = styled.div`
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-template-columns: 1fr 40px;
  grid-area: info;
`

const PlaceHolderDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid black; */
`

const MovieTitle = styled(TitleContainer)`
  /* flex */
  .title {
    padding-left: 2px;
    font-weight: 500;
    color: ${COLORS.primary};
  }
`

const ContentItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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
            <CloseIconContainerRight
              {...closeContainerProps}
              initial={{
                x: isMovieDetailsCardOpen ? -8 : -CARD_WIDTH + HANDLE_SIZE,
              }}
              animate={{
                x: isMovieDetailsCardOpen ? -8 : -CARD_WIDTH + HANDLE_SIZE,
                background: isMovieDetailsCardOpen
                  ? "rgba(255,255,255,1)"
                  : "rgba(255,255,255,0)",
                transition: {
                  type: "spring",
                  damping: 17,
                  delay: 0.5, // TODO: delay only on open close
                },
              }}
            >
              <motion.div whileHover={WHILE_HOVER}>
                <IoIosCloseCircle size={30} color={COLORS.secondaryDark} />
              </motion.div>
            </CloseIconContainerRight>
            <ArrowIconContainerRight {...arrowContainerProps}>
              <IoIosArrowBack size={24} color={COLORS.secondaryDark} />
            </ArrowIconContainerRight>
            <ContentGrid>
              <MainInfoContainer>
                <MovieTitle>
                  <LinesEllipsis
                    text="long long text"
                    maxLine="3"
                    ellipsis="..."
                    trimRight
                    basedOn="letters"
                  />
                </MovieTitle>
                <ContentItem>
                  <FavoriteStar isFavorited={true} isHovered={false} />
                </ContentItem>
              </MainInfoContainer>
              <ContentItem style={{ gridArea: "poster" }}>
                <Image
                  url={activeMovie.data.poster_path}
                  height={240}
                  alt={`${activeMovie.data.title}-poster`}
                />
              </ContentItem>
              <PlaceHolderDiv style={{ gridArea: "genres" }}>
                Genres
              </PlaceHolderDiv>
              <PlaceHolderDiv style={{ gridArea: "score" }}>
                Scrore
              </PlaceHolderDiv>
              <PlaceHolderDiv style={{ gridArea: "link" }}>Link</PlaceHolderDiv>
            </ContentGrid>
          </MovieDetailsCardRight>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeMovie.position === 1 && (
          <MovieDetailsCardLeft {...makeCardProps(makeLeftVariants(delay))}>
            <CloseIconContainerLeft {...closeContainerProps}>
              <motion.div whileHover={WHILE_HOVER}>
                <IoIosCloseCircle size={30} color={COLORS.secondaryDark} />
              </motion.div>
            </CloseIconContainerLeft>
            <ArrowIconContainerLeft {...arrowContainerProps}>
              <IoIosArrowForward size={24} color={COLORS.secondaryDark} />
            </ArrowIconContainerLeft>
            <ContentGrid>
              <ContentItem style={{ gridArea: "poster" }}>
                <Image
                  url={activeMovie.data.poster_path}
                  height={240}
                  alt={`${activeMovie.data.title}-poster`}
                />
              </ContentItem>
            </ContentGrid>
          </MovieDetailsCardLeft>
        )}
      </AnimatePresence>
    </>
  )
}
