import React from "react"
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
