import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import { Link } from "gatsby"
import { isMobile } from "react-device-detect"
import Image from "gatsby-image"

import styled from "styled-components"

import { FlexContainer, GridContainer, LinkAnchor } from "../components/atoms"
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
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`

const TextContainer = styled(GridContainer)`
  transition: all ${themifyTransition("sm")};
  background-color: transparent;
  color: transparent;
  :hover {
    background-color: rgba(51, 51, 51, 0.8);
    color: #fff;
  }
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
        {list.map(
          ({ node: { id, title, link, isOutside, image, description } }) => (
            <ItemContainer
              pos="relative"
              key={id}
              height="200px"
              align="flex-start"
              borderRadius={1}
            >
              <FlexContainer pos="relative" fullSize>
                <Image style={{ minWidth: "100%" }} fluid={image.fluid} />
              </FlexContainer>
              <TextContainer
                absPos
                fullSize
                rows="min-content 1fr min-content"
                paddingLeft={2}
                paddingRight={2}
                paddingTop={1}
                paddingBottom={1}
              >
                <FlexContainer
                  justify="flex-start"
                  fontWeight="medium"
                  fontSize={3}
                >
                  {title}
                </FlexContainer>
                <FlexContainer justify="flex-start" align="flex-start">
                  {description}
                </FlexContainer>
                <FlexContainer
                  justify="flex-end"
                  cursor="pointer"
                >
                  {!isOutside ? (
                    <Link to={`${link}`}>Find out more!</Link>
                  ) : (
                    <LinkAnchor
                      href={`${link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Find out more!
                    </LinkAnchor>
                  )}
                </FlexContainer>
              </TextContainer>
            </ItemContainer>
          )
        )}
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

// {/* <HoverContainer fullSize pos="relative" cursor="pointer">
//   {/* {!isOutside ? (
//   <Link to={`${link}`}>{title}</Link>
// ) : (
//   <a href={`${link}`} target="_blank" rel="noopener noreferrer">
//     {title}
//   </a>
// )} */}

// <Image style={{ minWidth: "100%" }} fluid={image.fluid} />
// </HoverContainer>
// <TextContainer
//   absPos
//   fullSize
//   rows="min-content 1fr"
//   paddingLeft={2}
//   paddingTop={1}
// >
//   <FlexContainer
//     fontColor="#fff"
//     justify="flex-start"
//     fontWeight="medium"
//     fontSize={3}
//   >
//     {title}
//   </FlexContainer>
//   <FlexContainer fontColor="#fff" justify="flex-start">
//     {description}
//   </FlexContainer>
// </TextContainer>
