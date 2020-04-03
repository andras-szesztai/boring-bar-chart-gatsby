import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import { Link } from "gatsby"
import { isMobile } from "react-device-detect"
import Image from "gatsby-image"

import styled from "styled-components"

import { FlexContainer, GridContainer } from "../components/atoms"
import { themifyTransition } from "../themes/mixins"

const MainGrid = styled(GridContainer)`
  padding: 3rem;
  grid-row-gap: 2rem;

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, 2fr);
    padding: 3rem;
    grid-column-gap: 3rem;
    grid-row-gap: 3rem;
  }
  @media (min-width: 1400px) {
    padding: 5rem;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 5rem;
    grid-row-gap: 4rem;
  }
`

const ItemContainer = styled(FlexContainer)`
  overflow: hidden;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3));
`

const HoverContainer = styled(FlexContainer)`
  transition: filter ${themifyTransition("sm")};
  filter: none;
  :hover {
    filter: grayscale(25%) brightness(0.25);
  }
`

const TextContainer = styled(FlexContainer)`
  color: "#fff";
`

export default function IndexPage({ data }) {
  const {
    allContentfulVisualizationsLink: { edges: list },
  } = data

  return (
    <>
      <Helmet title="Boring Bar Chart" />
      <FlexContainer height="80px">Header</FlexContainer>
      <MainGrid>
        {list.map(({ node: { id, title, link, isOutside, image } }) => (
          <ItemContainer
            key={id}
            height="200px"
            align="flex-start"
            borderRadius={1}
          >
            <HoverContainer fullSize pos="relative" cursor="pointer">
              <Image style={{ minWidth: "100%" }} fluid={image.fluid}  />
              {/* {!isOutside ? (
                <Link to={`${link}`}>{title}</Link>
              ) : (
                <a href={`${link}`} target="_blank" rel="noopener noreferrer">
                  {title}
                </a>
              )} */}
            </HoverContainer>
            <FlexContainer noPointerEvents absPos fullSize fontColor="#fff">
              Hello
            </FlexContainer>
          </ItemContainer>
        ))}
      </MainGrid>
    </>
  )
}

export const query = graphql`
  {
    allContentfulVisualizationsLink(sort: { fields: date, order: DESC }) {
      edges {
        node {
          date
          title
          id
          description
          link
          isOutside
          image {
            fluid {
              ...GatsbyContentfulFluid_tracedSVG
            }
          }
        }
      }
    }
  }
`
