import React from "react"
import { graphql } from "gatsby"
import PageTransition from "gatsby-plugin-page-transitions"

import { Layout, DataVisualizationGrid } from "../components/templates"
import { SiteHelmet } from "../components/molecules"

function IndexPage({ data }) {
  const {
    allContentfulVisualizationsLink: { edges: list },
  } = data

  return (
    <>
      <SiteHelmet />
      <PageTransition>
        <Layout>
          <div style={{ height: 75 }} />
          <DataVisualizationGrid list={list} />
        </Layout>
      </PageTransition>
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
          updated
          title
          id
          description
          link
          isOutside
          deviceTypes {
            mobile
            tablet
            desktop
          }
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
