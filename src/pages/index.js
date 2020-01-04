import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { FlexContainer } from "../components/atoms"

export default function IndexPage() {
  const {
    allStrapiDatasets: { edges },
  } = useStaticQuery(graphql`
    {
      allStrapiDatasets {
        edges {
          node {
            id
            name
            data {
              album
              year
            }
          }
        }
      }
    }
  `)
  
  return (
    <>
      <Helmet title="Boring Bar Chart" />
      <FlexContainer
        fontSize={2}
        fontWeight="bold"
      >
        Coming soon...
      </FlexContainer>
    </>
  )
}
