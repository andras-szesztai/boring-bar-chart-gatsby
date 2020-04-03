import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"

import { Layout, DataVisualizationGrid } from "../components/templates"

function IndexPage({ data }) {
  const {
    allContentfulVisualizationsLink: { edges: list },
  } = data

  return (
    <>
      <Helmet title="Boring Bar Chart" />
      <Layout>
        <DataVisualizationGrid list={list} />
      </Layout>
    </>
  )
}

export default IndexPage

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
