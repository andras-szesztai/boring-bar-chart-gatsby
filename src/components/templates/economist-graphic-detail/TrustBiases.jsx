import React from "react"
import styled from "styled-components"

import { FlexContainer, GridContainer, Title } from "../../atoms"
import { TrustBiasesChart } from "../../organisms/templateElemets/trustBiasesDashboard"

import { COUNTRY_ORDER } from "../../../constants/trustBiases"

const MainContainer = styled(GridContainer)`
  height: 650px;
  width: 700px;
  @media (max-width: 768px) {
    width: 500px;
  }
`

const ChartContainer = styled(FlexContainer)`
  height: 370px;
  width: 370px;
  transform: rotate(45deg);
  @media (max-width: 768px) {
    height: 280px;
    width: 280px;
  }
`

const AxisContainer = styled(FlexContainer)`
  top: 220px;
  transform: rotate(-90deg);
`

export default function TrustBiases({ data }) {
  return (
    <FlexContainer height="750px" width="100vw">
      <MainContainer withBorder rows="45px 1fr 40px">
        <FlexContainer withBorder justify="flex-start">
          <Title fontWeight="semiBold" fontSize={2}>
            Equity analysts are less likely to recommend stocks from countries
            their nation is biased against
          </Title>
        </FlexContainer>
        <FlexContainer withBorder>
          <ChartContainer withBorder pos="relative">
            <AxisContainer
              pos ="absolute"
              height="100%"
              direction="column"  
              justify="space-evenly"
              align="flex-end"
            >
              {
                COUNTRY_ORDER.map(country => <FlexContainer>{country}</FlexContainer>)
              }
            </AxisContainer>
            <TrustBiasesChart data={data} />
          </ChartContainer>
        </FlexContainer>
        <FlexContainer withBorder justify="flex-start" fontColor="gray">
          *How much people from one country trust people from another country,
          relative to the consensus and their general level of trust
        </FlexContainer>
      </MainContainer>
    </FlexContainer>
  )
}
