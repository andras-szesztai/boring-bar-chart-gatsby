import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { FlexContainer } from "../components/atoms"

export default function IndexPage() {
  const {
    allStrapiDatasets: { edges },
  } = useStaticQuery(graphql`
  {
    allStrapiDatasets(filter: {name: {eq: "New York AirBnB Dataset"}}) {
      edges {
        node {
          name
          data {
            room_type
            album
            availability_365
            calculated_host_listings_count
            host_id
            latitude
            longitude
            minimum_nights
            neighbourhood
            neighbourhood_group
            number_of_reviews
            price
            year
          }
          id
        }
      }
    }
  }
  `)

  console.log(edges);
  
  return (
    <>
      <Helmet title="Boring Bar Chart" />
      <FlexContainer
        fontSize={10}
        fontWeight={0}
        fullScreen
      >
        Coming soon
      </FlexContainer>
    </>
  )
}
