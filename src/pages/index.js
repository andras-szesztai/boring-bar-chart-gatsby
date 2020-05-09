import React, { useRef, useState } from "react"
import { graphql } from "gatsby"

import { Layout, DataVisualizationGrid } from "../components/templates"
import { SiteHelmet } from "../components/molecules"
import { useTransition } from "react-spring"

function IndexPage({ data }) {
  const {
    allContentfulVisualizationsLink: { edges: list },
  } = data

  const [isDataViz, setIsDataViz] = useState(true)

  console.log(list)
  return (
    <>
      <SiteHelmet />
      <Layout>
        <div style={{ height: 75 }} />
        <button onClick={() => setIsDataViz(prev => !prev)}>Toogle</button>
        <DataVisualizationGrid list={list} isDataViz={isDataViz} />
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
