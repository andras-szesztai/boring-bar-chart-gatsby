import React, { useState } from "react"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"
import {
  IoIosCloseCircle,
  IoIosSearch,
} from "react-icons/io"
import { FaExternalLinkSquareAlt } from "react-icons/fa"

import { makeCardProps } from "../utils"
import { makeLeftVariants } from "../styles"
import {
  NO_ACTIVE_MOVIE,
  WHILE_HOVER,
  COLORS,
} from "../../../../../../constants/moviesDashboard"
import { space } from "../../../../../../themes/theme"
import { TitleContainer } from "../../styles/styles"
import { themifyFontSize } from "../../../../../../themes/mixins"
import { TextContainer } from "../../FavoritesList/styles"
import Image from "../../Image/Image"
import { FavoriteStar } from "../../../../../molecules"
import HorizontalScrollList from "../../HorizontalScrollList/HorizontalScrollList"

const ContentGrid = styled(motion.div)`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0px;
  padding: ${space[3]}px;

  display: grid;
  grid-template-columns: 1fr 120px;
  grid-column-gap: ${space[3]}px;
  grid-template-rows: 185px repeat(3, 70px) 1fr;
  grid-row-gap: ${space[2]}px;
  grid-template-areas:
    "info poster"
    "genre genre"
    "crew crew"
    "cast cast"
    "link link";
`

const MainInfoContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(2, min-content) 1fr;
  grid-area: info;
  align-items: start;
  position: relative;
`

const MovieTitle = styled(TitleContainer)`
  color: ${COLORS.secondaryDark};
  line-height: 1.3;
  font-size: ${themifyFontSize(2)};
  cursor: default;
`

const SubTitle = styled(TitleContainer)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${themifyFontSize(1)};
  font-weight: 300;
  color: ${COLORS.textColor};
  cursor: pointer;
  margin-top: 2px;
  cursor: default;
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
`

const LinkContainer = styled.div`
  display: flex;

  align-items: center;
  grid-area: link;

  font-size: ${themifyFontSize(1)};
  color: ${COLORS.textColor};

  a {
    text-decoration: none;
    color: inherit;

    span {
      font-weight: 500;
    }
  }
`

const Row = styled.div`
  display: grid;
  grid-template-rows: 30px 1fr;
  font-size: ${themifyFontSize(1)};
`

const RowTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: ${COLORS.textColor};
  font-weight: 500;
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

export default function CardContent({
  activeMovie,
  positionCheck,
  card: Card,
  closeIconContainer: CloseIconContainer,
  iconsContainer: IconsContainer,
  delay,
  setActiveMovie,
  ref,
  refHeight,
  genreList,
  activeNameID,
  setActiveNameID,
}) {
  const arrowContainerProps = {
    role: "button",
    onClick: () =>
      setActiveMovie({
        activeMovie: NO_ACTIVE_MOVIE,
      }),
    whileHover: WHILE_HOVER,
  }

  const [isLinkHovered, setIsLinkHovered] = useState(false)
  return (
    <AnimatePresence>
      {activeMovie.position === positionCheck && (
        <Card {...makeCardProps(makeLeftVariants(delay))}>
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
              <Overview style={{ height: refHeight - space[2] }}>
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
            <LinkContainer style={{ justifyContent: "flex-start" }}>
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
