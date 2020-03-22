import React from "react"
import styled from "styled-components"

import { FlexContainer, GridContainer } from "../../atoms"
import { useWindowDimensions, useUniqValuesList } from "../../../hooks"

const MainGrid = styled(GridContainer)`
  @media (min-width: 450px) {
    height: 95%;
    width: 95%;
    grid-template-columns: 1fr;
    grid-template-rows: 45fr 55fr;
  }

  @media (min-width: 750px) {
    height: 95%;
    width: 96%;
    grid-template-columns: 30fr 70fr;
    grid-template-rows: 1fr;
  }

  @media (min-width: 1000px) {
    height: 95%;
    width: 96%;
    grid-template-columns: 32.5fr 67.5fr;
    grid-template-rows: 1fr;
  }

  @media (min-width: 1400px) {
    height: 92.5%;
    width: 95%;
    grid-template-columns: 35fr 65fr;
  }

  @media only screen and (max-device-width: 1366px) and (orientation: landscape) {
    height: 95%;
    width: 96%;
    grid-template-columns: 35fr 65fr;
  }
  @media only screen and (max-device-width: 1024px) and (orientation: portrait) {
    height: 96%;
    width: 95%;
    grid-template-rows: 4fr 6fr;
    grid-template-columns: 1fr;
  }

  @media only screen and (max-device-width: 820px) and (orientation: landscape) {
    height: 95%;
    width: 97.5%;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
  @media only screen and (max-device-width: 480px) and (orientation: portrait) {
    height: 97.5%;
    width: 95%;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
`

export default function WasteManagemetDashboard({ data, loading }) {
  const { windowWidth, windowHeight } = useWindowDimensions()
  const countryList = useUniqValuesList(data, "country", ["EU 28"])

  console.log(windowWidth, windowHeight)
  let isSmallScreen
  if (
    (windowWidth && windowWidth <= 450 && windowHeight <= 850) ||
    (windowHeight <= 450 && windowWidth <= 850)
  ) {
    isSmallScreen = true
  }

  console.log(isSmallScreen)

  return (
    <FlexContainer fullScreen>
      <MainGrid maxWidth="1400px">
        <GridContainer withBorder></GridContainer>
        {!isSmallScreen && (
          <GridContainer
            columns="repeat(5, 1fr)"
            rows="repeat(5, 1fr)"
          >
            {countryList.map(country => (
              <FlexContainer withBorder>{country}</FlexContainer>
            ))}
          </GridContainer>
        )}
      </MainGrid>
    </FlexContainer>
  )
}
