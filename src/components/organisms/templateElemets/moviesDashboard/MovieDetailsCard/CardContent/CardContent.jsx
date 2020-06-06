import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { IoIosCloseCircle, IoIosSearch } from "react-icons/io"
import { FaExternalLinkSquareAlt } from "react-icons/fa"
import { useMeasure } from "react-use"


import { FavoriteStar } from "../../../../../molecules"
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

export default function CardContent(props) {
  const {
    activeMovie,
    activeNameID,
    setActiveNameID,
    card: Card,
    closeIconContainer: CloseIconContainer,
    iconsContainer: IconsContainer,
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

  return (
    <AnimatePresence>
      {activeMovie.position === props.positionCheck && (
        <Card {...props.cardAnimationProps}>
          <CloseIconContainer {...arrowContainerProps}>
            <IoIosCloseCircle size={28} color={COLORS.secondaryDark} />
          </CloseIconContainer>
          <ContentGrid>
            <MainInfoContainer>
              <MovieTitle>{activeMovie.data.title}</MovieTitle>
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
            <IconsContainer>
              <motion.div whileHover={WHILE_HOVER}>
                <FavoriteStar isFavorited={true} isHovered={false} />
              </motion.div>
              <motion.div whileHover={WHILE_HOVER}>
                <FavoriteStar isFavorited={true} isHovered={false} />
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
            <LinkContainer style={{ justifyContent: props.justifyLink }}>
              <a
                href={`https://www.themoviedb.org/${activeMovie.data.media_type}/${activeMovie.data.id}`}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsLinkHovered(true)}
                onMouseLeave={() => setIsLinkHovered(false)}
              >
                Find out more on <span>TMBD</span>
              </a>
              <motion.div
                style={{ marginLeft: 8, paddingTop: 5 }}
                animate={{ scale: isLinkHovered ? 1.3 : 1 }}
              >
                <FaExternalLinkSquareAlt size={24} />
              </motion.div>
            </LinkContainer>
          </ContentGrid>
        </Card>
      )}
    </AnimatePresence>
  )
}
