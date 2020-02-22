import React from "react"
import styled from "styled-components"

import { FlexContainer, GridContainer, Title } from "../../atoms"

const MainContainer = styled(GridContainer)`
  height: 650px;
  width: 700px;
  @media (max-width: 768px) {
    width: 500px;
  }
`



export default function TrustBiases({ data }) {
  return (
    <FlexContainer height="750px" width="100vw">
      <MainContainer withBorder rows="45px 1fr 40px">
        <FlexContainer withBorder justify="flex-start">
          <Title
            fontWeight="semiBold"
            fontSize={2}
          >
            Equity analysts are less likely to recommend stocks from countries
            their nation is biased against
          </Title>
        </FlexContainer>
        <FlexContainer withBorder>Chart</FlexContainer>
        <FlexContainer withBorder justify="flex-start" fontColor="gray">
        *How much people from one country trust people from another country, relative to the consensus and their general level of trust
        </FlexContainer>
      </MainContainer>
    </FlexContainer>
  )
}
