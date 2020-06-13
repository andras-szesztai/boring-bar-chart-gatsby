import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { IoIosCloseCircle, IoIosSearch } from "react-icons/io"
import { FaExternalLinkSquareAlt } from "react-icons/fa"
import { useMeasure } from "react-use"

import { FavoriteHeart } from "../../../../../molecules"
import Image from "../../Image/Image"
import HorizontalScrollList from "../../HorizontalScrollList/HorizontalScrollList"

import {
  ContentGrid,
  MainInfoContainer,
  MovieTitle,
  SubTitle,
  ContentItem,
  Overview,
  Row,
  RowTitle,
  LinkContainer,
} from "./styles"
import { space } from "../../../../../../themes/theme"

import {
  NO_ACTIVE_MOVIE,
  WHILE_HOVER,
  COLORS,
} from "../../../../../../constants/moviesDashboard"

const HoverContentCast = ({ animateProps, data }) => {
  return (
    <motion.div initial={{ opacity: 0 }} {...animateProps}>
      {data.character}
    </motion.div>
  )
}

const HoverContentCrew = ({ animateProps, data }) => {
  return (
    <motion.div initial={{ opacity: 0 }} {...animateProps}>
      {data.job}
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

export default function CardContent(props) {
  const {
    activeMovie,
    activeNameID,
    setActiveNameID,
    card: Card,
    closeIconContainer: CloseIconContainer,
    iconsContainer: IconsContainer,
    setFavoriteMovies,
    favoriteMovies,
  } = props
  const [isLinkHovered, setIsLinkHovered] = useState(false)
  const [ref, { height }] = useMeasure()
  const arrowContainerProps = {
    role: "button",
    onClick: () =>
      props.setActiveMovie({
        activeMovie: NO_ACTIVE_MOVIE,
      }),
    whileHover: WHILE_HOVER,
  }

  const [isFavoriteHovered, setIsFavoriteHovered] = useState(false)
  const interactionProps = {
    onMouseEnter: () => setIsFavoriteHovered(true),
    onMouseLeave: () => setIsFavoriteHovered(false),
    onClick: () => setFavoriteMovies(),
  }
  console.log("CardContent -> activeMovie", activeMovie)

  return (
    <AnimatePresence>
      {activeMovie.position === props.positionCheck && (
        <Card {...props.cardAnimationProps}>
          <CloseIconContainer {...arrowContainerProps}>
            <IoIosCloseCircle size={28} color={COLORS.secondaryDark} />
          </CloseIconContainer>
          <ContentGrid>
            <MainInfoContainer>
              <MovieTitle role="button" {...interactionProps}>
                {activeMovie.data.title}
              </MovieTitle>
              <SubTitle>{activeMovie.data.release_date.slice(0, 4)}</SubTitle>
              <div
                ref={ref}
                style={{ position: "relative", alignSelf: "stretch" }}
              />
              <Overview style={{ height: height - space[2] }}>
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
            <IconsContainer
              role="button"
              {...interactionProps}
              animate={{ scale: isFavoriteHovered ? 1.3 : 1, originY: 0.6 }}
            >
              <motion.div>
                <FavoriteHeart isFavorited={true} isHovered={false} />
              </motion.div>
            </IconsContainer>
            <Row style={{ gridArea: "genre" }}>
              <RowTitle>Genres</RowTitle>
              <HorizontalScrollList
                type="genre"
                array={props.genreList.filter(el =>
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
                hoverContent={HoverContentCrew}
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
                hoverContent={HoverContentCast}
                mouseDownContent={MouseDownContent}
                activeNameID={activeNameID}
                setActiveNameID={setActiveNameID}
              />
            </Row>
            <LinkContainer style={{ justifyContent: props.justifyLink }}>
              <a
                href={`https://www.themoviedb.org/${activeMovie.data.media_type}/${activeMovie.data.id}`}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsLinkHovered(true)}
                onMouseLeave={() => setIsLinkHovered(false)}
              >
                Click here to find out more on <span>TMBD</span>
              </a>
              <motion.div
                style={{ marginLeft: 6, paddingTop: 5 }}
                animate={{ scale: isLinkHovered ? 1.3 : 1 }}
              >
                <FaExternalLinkSquareAlt size={22} />
              </motion.div>
            </LinkContainer>
          </ContentGrid>
        </Card>
      )}
    </AnimatePresence>
  )
}
