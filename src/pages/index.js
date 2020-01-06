import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { FlexContainer } from "../components/atoms"

export default function IndexPage() {
  
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
