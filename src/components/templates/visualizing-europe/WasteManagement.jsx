import React, { useState } from "react"
import styled from "styled-components"

import { FlexContainer, GridContainer } from "../../atoms"
import { useWindowDimensions } from "../../../hooks"
import {
  styledComponents,
  TitleContainer,
  SmallChartContainer,
  BigChartsContainer,
} from "../../organisms/templateElemets/wasteManagementDashboard"
import { colors } from "../../../themes/theme"
import { FullScreenLoader } from "../../molecules"
const { MainGrid, MainChartsContainer } = styledComponents

export default function WasteManagemetDashboard({
  data,
  loading,
  countryList,
}) {
  const { windowWidth, windowHeight } = useWindowDimensions()
  const [metric, setMetric] = useState("abs")
  const [selectedCountry, setSelectedCountry] = useState(undefined)

  let isSmallScreen
  if (
    (windowWidth && windowWidth <= 450 && windowHeight <= 850) ||
    (windowHeight <= 450 && windowWidth <= 850)
  ) {
    isSmallScreen = true
  }

  return (
    <>
      <FlexContainer fullScreen>
        <FullScreenLoader loading={loading} />
        <MainGrid maxWidth="1400px">
          <MainChartsContainer>
            <TitleContainer metric={metric} setMetric={setMetric} />
            <BigChartsContainer
              selectedCountry={selectedCountry}
              countryList={countryList}
              metric={metric}
              data={data}
            />
          </MainChartsContainer>
          {!isSmallScreen && (
            <GridContainer columns="repeat(5, 1fr)" rows="repeat(5, 1fr)">
              {countryList &&
                countryList.map((country, i) => (
                  <SmallChartContainer
                    key={country}
                    value={country}
                    data={data[country]}
                    metric={metric}
                    setSelected={setSelectedCountry}
                    selectedValue={selectedCountry}
                  />
                ))}
            </GridContainer>
          )}
        </MainGrid>
      </FlexContainer>
    </>
  )
}
