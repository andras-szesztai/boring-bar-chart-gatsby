import React from "react"
import styled from "styled-components"

import { FlexContainer, GridContainer, Title } from "../../atoms"
import { TrustBiasesChart } from "../../organisms/templateElemets/trustBiasesDashboard"

import { COUNTRY_ORDER, TEXTS } from "../../../constants/trustBiases"

const { TITLE, EXPLANATION, LEFT_TEXT, RIGHT_TEXT } = TEXTS

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

const AxisContainerLeft = styled(FlexContainer)`
  top: 220px;
  transform: rotate(-90deg);
`

const AxisContainerRight = styled(FlexContainer)`
  left: calc(100% + 5px);
`

const axisProps = {
  pos: "absolute",
  height: "100%",
  direction: "column",
  justify: "space-evenly",
}

const countryList = COUNTRY_ORDER.map(country => (
  <FlexContainer>{country}</FlexContainer>
))

function handleMouseover() {}
function handleMouseout() {}

// LEFT_TEXT, RIGHT_TEXT
export default function TrustBiases({ data }) {
  return (
    <FlexContainer height="750px" width="100vw">
      <MainContainer rows="30px 1fr 40px">
        <FlexContainer justify="flex-start">
          <Title fontWeight="semiBold" fontSize={2}>
            {TITLE}
          </Title>
        </FlexContainer>
        <FlexContainer pos="relative">
          <GridContainer
            withBorder
            absPos
            top={40}
            left={5}
            rows="repeat(2, 1fr)"
            rowGap={0}
            width="100px"
            height="50px"
            direction="column"
          >
            <FlexContainer fullSize>Origin</FlexContainer>
            <FlexContainer>Destination</FlexContainer>
          </GridContainer>

          <ChartContainer pos="relative">
            <AxisContainerLeft {...axisProps} align="flex-end">
              {countryList}
            </AxisContainerLeft>
            <AxisContainerRight {...axisProps} align="flex-start">
              {countryList}
            </AxisContainerRight>
            <TrustBiasesChart
              data={data}
              handleMouseover={handleMouseover}
              handleMouseout={handleMouseout}
            />
          </ChartContainer>
          <FlexContainer
            absPos
            bottom={25}
            left={50}
            width="100px"
            fontWeight="semiBold"
            textAlign="end"
          >
            {LEFT_TEXT}
          </FlexContainer>
          <FlexContainer
            absPos
            bottom={25}
            right={50}
            width="100px"
            fontWeight="semiBold"
          >
            {RIGHT_TEXT}
          </FlexContainer>
        </FlexContainer>
        <FlexContainer justify="flex-start" fontColor="gray">
          {EXPLANATION}
        </FlexContainer>
      </MainContainer>
    </FlexContainer>
  )
}
