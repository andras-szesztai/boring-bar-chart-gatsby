import React, { useState } from "react"
import styled, { css } from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import chroma from "chroma-js"
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosClose,
  IoIosCloseCircle,
  IoIosSearch,
} from "react-icons/io"

import {
  CARD_WIDTH,
  HANDLE_SIZE,
  WHILE_HOVER,
  COLORS,
  NO_ACTIVE_MOVIE,
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
import { TitleContainer, TextContainer, dentedStyling } from "../styles/styles"
import { space } from "../../../../../themes/theme"
import { FavoriteStar } from "../../../../molecules"
import { themifyFontSize } from "../../../../../themes/mixins"
import { useMeasure } from "react-use"
import HorizontalScrollList from "../HorizontalScrollList/HorizontalScrollList"

const ContentGrid = styled(motion.div)`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0px;
  padding: ${space[3]}px;

  display: grid;
  grid-template-columns: 1fr 120px;
  grid-column-gap: ${space[3]}px;
  grid-template-rows: 170px repeat(4, 55px) 1fr;
  grid-row-gap: ${space[2]}px;
  grid-template-areas:
    "info poster"
    "genre genre"
    "crew crew"
    "cast cast"
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
  border: 1px solid black;
`

const MovieTitle = styled(TitleContainer)`
  color: ${COLORS.secondaryDark};
  line-height: 1.3;
  font-size: ${themifyFontSize(2)};
`

const SubTitle = styled(TitleContainer)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${themifyFontSize(1)};
  font-weight: 200;
  color: ${COLORS.textColor};
  cursor: pointer;
  margin-top: 2px;
`

const Overview = styled(TextContainer)`
  margin-top: 0px;
  width: 100%;
  position: absolute;
  bottom: 0px;
`

const ContentItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`

const LinkContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  grid-area: link;
`

const Row = styled.div`
  display: grid;
  grid-template-rows: 25px 1fr;
  font-size: ${themifyFontSize(1)};
`

const RowTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const HoverContent = ({ animateProps, data, accessor }) => {
  return (
    <motion.div initial={{ opacity: 0 }} {...animateProps}>
      {data[accessor]}
    </motion.div>
  )
}

const MouseDownContent = ({ bgColor }) => {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        transform: "translate(5px, 0.5px)",
      }}
    >
      <IoIosSearch size={14} color={bgColor} />{" "}
      <div
        style={{
          transform: "translate(4px, -1px)",
        }}
      >
        Search
      </div>
    </div>
  )
}

export default function MovieDetailsCardComponent({
  activeMovie,
  prevActiveMovie,
  setActiveMovie,
  genreList,
  activeNameID,
  setActiveNameID,
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
    onClick: () =>
      setActiveMovie({
        activeMovie: NO_ACTIVE_MOVIE,
      }),
  }

  const [rightOverviewRef, { height: rightHeight }] = useMeasure()
  const [leftOverviewRef, { height: leftHeight }] = useMeasure()


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
                <MovieTitle>{activeMovie.data.title}</MovieTitle>
                <SubTitle>{activeMovie.data.release_date.slice(0, 4)}</SubTitle>
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
              <Row style={{ gridArea: "genre" }}>
                <RowTitle>Genres</RowTitle>
                <HorizontalScrollList
                  type="genre"
                  array={genreList.filter(el =>
                    activeMovie.data.genre_ids.includes(el.id)
                  )}
                  bgColor={COLORS.textColor}
                />
              </Row>
              <Row style={{ gridArea: "crew" }}>
                <RowTitle>Lead crew</RowTitle>
                <HorizontalScrollList
                  type="crew"
                  array={activeMovie.crew}
                  bgColor={COLORS.primary}
                  hoverContent={HoverContent}
                  hoverContentProps={{
                    accessor: "job",
                  }}
                  mouseDownContent={MouseDownContent}
                  activeNameID={activeNameID}
                  setActiveNameID={setActiveNameID}
                />
              </Row>
              <Row style={{ gridArea: "cast" }}>
                <RowTitle>Lead cast</RowTitle>
                <HorizontalScrollList
                  type="cast"
                  array={activeMovie.cast}
                  bgColor={COLORS.primary}
                  hoverContent={HoverContent}
                  hoverContentProps={{
                    accessor: "character",
                  }}
                  mouseDownContent={MouseDownContent}
                  activeNameID={activeNameID}
                  setActiveNameID={setActiveNameID}
                />
              </Row>
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
      {/* <AnimatePresence>
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
      </AnimatePresence> */}
    </>
  )
}
