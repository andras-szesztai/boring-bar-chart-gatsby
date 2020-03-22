import React from "react"
import styled from "styled-components"

import { FlexContainer, GridContainer } from "../../atoms"
import { useWindowDimensions, useUniqValuesList } from "../../../hooks"
import { styledComponents } from "../../organisms/templateElemets/wasteManagementDashboard"
const { MainGrid, MainChartsContainer } = styledComponents



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

  return (
    <FlexContainer fullScreen>
      <MainGrid maxWidth="1400px">
        <MainChartsContainer>
          <GridContainer  columns="min-content 1fr" gridArea="title" withBorder>
            <FlexContainer>Title</FlexContainer>
            <FlexContainer>Switch</FlexContainer>
          </GridContainer>
          <GridContainer rows="30px 1fr" gridArea="chartOne" withBorder>
            <FlexContainer>Spaceholder</FlexContainer>
            <FlexContainer>Chart 1</FlexContainer>
          </GridContainer>
          <GridContainer rows="30px 1fr" gridArea="chartTwo" withBorder>
            <FlexContainer>Selector</FlexContainer>
            <FlexContainer>Chart 2</FlexContainer>
          </GridContainer>
        </MainChartsContainer>
        {!isSmallScreen && (
          <GridContainer columns="repeat(5, 1fr)" rows="repeat(5, 1fr)">
            {countryList &&
              countryList.map(country => (
                <FlexContainer withBorder>{country}</FlexContainer>
              ))}
          </GridContainer>
        )}
      </MainGrid>
    </FlexContainer>
  )
}
