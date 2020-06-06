import React from "react"
import styled from "styled-components"

import { HANDLE_SIZE } from "../../../../../constants/moviesDashboard"
import {
  MovieDetailsCardRight,
  MovieDetailsCardLeft,
  CloseIconContainerLeft,
  CloseIconContainerRight,
  makeLeftVariants,
  makeRightVariants,
} from "./styles"
import CardContent from "./CardContent/CardContent"
import { makeCardProps } from "./utils"

const IconsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  position: absolute;

  top: 0px;

  border-radius: 0 0 0 2px;
  width: ${HANDLE_SIZE}px;
  height: ${HANDLE_SIZE * 2}px;
  z-index: 4;

  .icon {
    cursor: pointer;
  }
`

const IconsContainerRight = styled(IconsContainer)`
  left: -${HANDLE_SIZE - 4}px;
`

const IconsContainerLeft = styled(IconsContainer)`
  right: -${HANDLE_SIZE - 4}px;
`

export default function MovieDetailsCardComponent(props) {
  const delay = typeof props.prevActiveMovie.position == "number" ? 0.5 : 0

  return (
    <>
      <CardContent
        {...props}
        positionCheck={0}
        card={MovieDetailsCardRight}
        closeIconContainer={CloseIconContainerRight}
        iconsContainer={IconsContainerRight}
        cardAnimationProps={makeCardProps(makeRightVariants(delay))}
      />
      <CardContent
        {...props}
        positionCheck={1}
        card={MovieDetailsCardLeft}
        closeIconContainer={CloseIconContainerLeft}
        iconsContainer={IconsContainerLeft}
        cardAnimationProps={makeCardProps(makeLeftVariants(delay))}
      />
      {/* <AnimatePresence>
        {activeMovie.position === 0 && (
          <MovieDetailsCardRight {...makeCardProps(makeRightVariants(delay))}>
            <CloseIconContainerRight {...arrowContainerProps}>
              <IoIosCloseCircle size={28} color={COLORS.secondaryDark} />
            </CloseIconContainerRight>
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
              <IconsContainerRight>
                <motion.div whileHover={WHILE_HOVER}>
                  <FavoriteStar isFavorited={true} isHovered={false} />
                </motion.div>
                <motion.div whileHover={WHILE_HOVER}>
                  <FavoriteStar isFavorited={true} isHovered={false} />
                </motion.div>
              </IconsContainerRight>
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
              <LinkContainer style={{ justifyContent: "flex-end" }}>
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
          </MovieDetailsCardRight>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMovie.position === 1 && (
          <MovieDetailsCardLeft {...makeCardProps(makeLeftVariants(delay))}>
            <CloseIconContainerLeft {...arrowContainerProps}>
              <IoIosCloseCircle size={28} color={COLORS.secondaryDark} />
            </CloseIconContainerLeft>
            <ContentGrid>
              <MainInfoContainer>
                <MovieTitle>{activeMovie.data.title}</MovieTitle>
                <SubTitle>{activeMovie.data.release_date.slice(0, 4)}</SubTitle>
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
              <IconsContainerLeft>
                <motion.div whileHover={WHILE_HOVER}>
                  <FavoriteStar isFavorited={true} isHovered={false} />
                </motion.div>
                <motion.div whileHover={WHILE_HOVER}>
                  <FavoriteStar isFavorited={true} isHovered={false} />
                </motion.div>
              </IconsContainerLeft>
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
          </MovieDetailsCardLeft>
        )}
      </AnimatePresence> */}
    </>
  )
}
