import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import { Link } from "gatsby"
import { isMobile } from "react-device-detect"
import Image from "gatsby-image"

import styled from "styled-components"

import { FlexContainer, GridContainer, LinkAnchor } from "../components/atoms"
import { themifyTransition, themifySpace, themifyColor } from "../themes/mixins"

const Layout = styled(GridContainer)`
  grid-template-rows: 50px 1fr;
  grid-row-gap: 0;
  max-height: 100vh;
  padding-bottom: 2rem;
`

const HeaderContainer = styled(FlexContainer)`
  width: 100vw;
  height: 50px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 3rem;
`

const MainGrid = styled(GridContainer)`
  padding: 3rem;
  overflow-y: scroll;
  grid-row-gap: 1rem;

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, 2fr);
    padding: 3rem;
    grid-column-gap: 3rem;
    grid-row-gap: 2rem;
  }
  @media (min-width: 1400px) {
    padding: 5rem;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 5rem;
    grid-row-gap: 3rem;
  }
`

const ItemContainer = styled(FlexContainer)`
  overflow: hidden;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
`

const TextContainer = styled(GridContainer)`
  transition: all ${themifyTransition("sm")};
  background-color: transparent;
  color: transparent;
  :hover {
    background-color: rgba(51, 51, 51, 0.9);
    color: #fff;
  }
`

const SingleText = styled(FlexContainer)`
  transition: all ${themifyTransition("sm")};
  color: transparent;

  ${TextContainer}:hover & {
    color: #fff;
  }
`

const LinkContainer = styled(FlexContainer)`
  background-color: transparent;
  padding: ${themifySpace(1)}px ${themifySpace(2)}px;
  border-radius: ${themifySpace(1)}px;
  a {
    color: transparent;
    text-decoration: none;
  }
  ${TextContainer}:hover & {
    background-color: #fff;
    a {
      color: ${themifyColor("grayDarkest")};
    }
  }

  :hover {
    a {
      color: ${themifyColor("#000")};
    }
  }
`

export default function IndexPage({ data }) {
  const {
    allContentfulVisualizationsLink: { edges: list },
  } = data

  return (
    <>
      <Helmet title="Boring Bar Chart" />
      <Layout>
        <HeaderContainer justify="space-between">
          <FlexContainer>Icon</FlexContainer>
          <FlexContainer>Social links</FlexContainer>
        </HeaderContainer>
        <MainGrid>
          {list.map(
            ({ node: { id, title, link, isOutside, image, description } }) => (
              <ItemContainer
                pos="relative"
                key={id}
                height="200px"
                borderRadius={1}
              >
                <FlexContainer pos="relative" fullSize align="flex-start">
                  <Image style={{ minWidth: "100%" }} fluid={image.fluid} />
                </FlexContainer>
                <TextContainer
                  absPos
                  fullSize
                  rows="min-content 1fr min-content"
                  paddingLeft={3}
                  paddingRight={3}
                  paddingTop={2}
                  paddingBottom={3}
                  rowGap={2}
                >
                  <SingleText
                    justify="flex-start"
                    fontWeight="medium"
                    fontSize={3}
                    lineHeight={1.25}
                  >
                    {title}
                  </SingleText>
                  <SingleText justify="flex-start" align="flex-start">
                    {description}
                  </SingleText>
                  <SingleText justify="flex-end">
                    <LinkContainer fontWeight="medium" cursor="pointer">
                      {!isOutside ? (
                        <Link to={`${link}`}>Find out more!</Link>
                      ) : (
                        <a
                          href={`${link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Find out more!
                        </a>
                      )}
                    </LinkContainer>
                  </SingleText>
                </TextContainer>
              </ItemContainer>
            )
          )}
        </MainGrid>
      </Layout>
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
