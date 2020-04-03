import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import { Link } from "gatsby"
import Image from "gatsby-image"

import styled from "styled-components"

import { FlexContainer, GridContainer } from "../components/atoms"

const MainGrid = styled(GridContainer)`
  padding: 1rem;
  grid-row-gap: 1rem;

  @media (min-width: 700px) {
    padding: 2rem;
    grid-template-columns: repeat(2, 2fr);
    grid-column-gap: 2rem;
    grid-row-gap: 2rem;
  }
  @media (min-width: 1400px) {
    padding: 3rem;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 3rem;
    grid-row-gap: 3rem;
  }
`

export default function IndexPage({ data }) {
  const {
    allContentfulVisualizationsLink: { edges: list },
  } = data

  return (
    <>
      <Helmet title="Boring Bar Chart" />
      <FlexContainer height="100px">Header</FlexContainer>
      <MainGrid>
        {list.map(({ node: { id, title, link, isOutside, image } }) => (
          <FlexContainer key={id} withBorder height="200px">
          <Image
              style={{ width: 250, borderRadius: 2 }}
              fluid={image.fluid}
            />
            {!isOutside ? (
              <Link to={`${link}`}>{title}</Link>
            ) : (
              <a href={`${link}`} target="_blank" rel="noopener noreferrer">
                {title}
              </a>
            )}
          </FlexContainer>
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
