import React from "react"
import styled, { css } from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosClose,
  IoIosCloseCircle,
} from "react-icons/io"

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
import { TitleContainer, TextContainer } from "../styles/styles"
import { space } from "../../../../../themes/theme"
import { FavoriteStar } from "../../../../molecules"
import { themifyFontSize } from "../../../../../themes/mixins"
import { useMeasure } from "react-use"

const ContentGrid = styled(motion.div)`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0px;
  padding: ${space[3]}px;

  display: grid;
  grid-template-columns: 1fr 120px;
  grid-column-gap: ${space[3]}px;
  grid-template-rows: 180px 60px 120px 1fr ${HANDLE_SIZE / 2}px;
  grid-template-areas:
    "info poster"
    "genres genres"
    "credits credits"
    "score score"
    "link link";
`

const MainInfoContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(2, min-content) 1fr;
  grid-area: info;
  align-items: start;
  position: relative;
`

const PlaceHolderDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid black; */
`

const MovieTitle = styled(TitleContainer)`
  color: ${COLORS.secondaryDark};
  line-height: 1.15;
  font-size: ${themifyFontSize(3)};
`

const SubTitle = styled(TitleContainer)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${themifyFontSize(1)};
  font-weight: 200;
  color: ${COLORS.textColor};
  cursor: pointer;
`

const Overview = styled(TextContainer)`
  margin-top: 0px;
  width: auto;
  position: absolute;
  bottom: 0px;
`

const ContentItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`

// TODO: finish styling with icon FaExternalLinkSquareAlt
const LinkContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  grid-area: link;
`

// TODO: style genre list
const GenreList = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  grid-area: genres;
  overflow-x: auto;
  font-size: ${themifyFontSize(1)};
`

export default function MovieDetailsCardComponent({
  activeMovie,
  prevActiveMovie,
  setActiveMovie,
  genres,
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

  const [rightOverviewRef, { height: rightHeight }] = useMeasure()
  const [leftOverviewRef, { height: leftHeight }] = useMeasure()

  // TODO: fetch credit (endpoint depends if movie or tv)
  // TODO: clean up duplicate code

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
                  delay: 0.5,
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
                  {activeMovie.data.title}
                  <div style={{ marginTop: -3 }}>
                    <FavoriteStar isFavorited={true} isHovered={false} />
                  </div>
                </MovieTitle>
                {activeMovie.data.title !== activeMovie.data.original_title ? (
                  <SubTitle>{activeMovie.data.original_title}</SubTitle>
                ) : (
                  <div />
                )}
                <div
                  ref={rightOverviewRef}
                  style={{ position: "relative", alignSelf: "stretch" }}
                />
                <Overview style={{ height: rightHeight - space[2] }}>
                  {activeMovie.data.overview}
                </Overview>
              </MainInfoContainer>
              <ContentItem style={{ gridArea: "poster" }}>
                <Image
                  url={activeMovie.data.poster_path}
                  height={180}
                  alt={`${activeMovie.data.title}-poster`}
                />
              </ContentItem>
              <GenreList>
                Genres:&nbsp;
                {activeMovie.data.genre_ids.map(id => (
                  <span>{genres.find(genre => genre.id === id).name},&nbsp;</span>
                ))}
              </GenreList>
              <PlaceHolderDiv style={{ gridArea: "credits" }}>
                Credits come here (top cast & crew)
              </PlaceHolderDiv>
              <PlaceHolderDiv style={{ gridArea: "score" }}>
                Score comes here
              </PlaceHolderDiv>
              <LinkContainer>
                <a
                  href={`https://www.themoviedb.org/${activeMovie.data.media_type}/${activeMovie.data.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Find out more on TMBD
                </a>
              </LinkContainer>
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
              <MainInfoContainer>
                <MovieTitle>
                  {activeMovie.data.title}
                  <div style={{ marginTop: -3 }}>
                    <FavoriteStar isFavorited={true} isHovered={false} />
                  </div>
                </MovieTitle>
                {activeMovie.data.title !== activeMovie.data.original_title ? (
                  <SubTitle>{activeMovie.data.original_title}</SubTitle>
                ) : (
                  <div />
                )}
                <div
                  ref={leftOverviewRef}
                  style={{ position: "relative", alignSelf: "stretch" }}
                />
                <Overview style={{ height: leftHeight - space[2] }}>
                  {activeMovie.data.overview}
                </Overview>
              </MainInfoContainer>
              <ContentItem style={{ gridArea: "poster" }}>
                <Image
                  url={activeMovie.data.poster_path}
                  height={180}
                  alt={`${activeMovie.data.title}-poster`}
                />
              </ContentItem>
              <GenreList>
                Genres:&nbsp;
                {activeMovie.data.genre_ids.map(id => (
                  <span>{genres.find(genre => genre.id === id).name},&nbsp;</span>
                ))}
              </GenreList>
              <PlaceHolderDiv style={{ gridArea: "credits" }}>
                Credits come here (top cast & crew)
              </PlaceHolderDiv>
              <PlaceHolderDiv style={{ gridArea: "score" }}>
                Score comes here
              </PlaceHolderDiv>
              <LinkContainer>
                <a
                  href={`https://www.themoviedb.org/${activeMovie.data.media_type}/${activeMovie.data.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Find out more on TMBD
                </a>
              </LinkContainer>
            </ContentGrid>
          </MovieDetailsCardLeft>
        )}
      </AnimatePresence>
    </>
  )
}
