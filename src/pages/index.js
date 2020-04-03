import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import { Link } from "gatsby"

import { FlexContainer } from "../components/atoms"

export default function IndexPage({ data }) {
  const {
    allContentfulVisualizationsLink: { edges: list },
  } = data

  return (
    <>
      <Helmet title="Boring Bar Chart" />
      <FlexContainer
        fullScreen
        direction="column"
      >
        {list.map(({ node: { title, link, isOutside } }) =>
          !isOutside ? (
            <Link to={`${link}`}>{title}</Link>
          ) : (
            <a href={`${link}`} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          )
        )}
      </FlexContainer>
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
