import React, { useState } from "react"
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

import { FlexContainer, GridContainer } from "../../atoms"
import { useWindowDimensions } from "../../../hooks"
import {
  styledComponents,
  TitleContainer,
  SmallChartContainer,
  BigChartsContainer,
} from "../../organisms/templateElemets/wasteManagementDashboard"
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

  if(isBrowser){
    console.log('browser')
  }
  return (
    <>
      <FlexContainer fullScreen>
        {/* <div>{BrowserView.toString()}</div>
        <div>{MobileView.toString()}</div>
        <div>{isBrowser.toString()}</div>
        <div>{isMobile.toString()}</div> */}
        <FullScreenLoader loading={loading} />
        <MainGrid maxWidth="1400px">
          <MainChartsContainer>
            <TitleContainer metric={metric} setMetric={setMetric} isSmallScreen={isSmallScreen} />
            <BigChartsContainer
              isSmallScreen={isSmallScreen}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              countryList={countryList}
              metric={metric}
              data={data}
            />
          </MainChartsContainer>
          {!isSmallScreen && (
            <GridContainer columns="repeat(5, 1fr)" rows="repeat(5, 1fr)">
              {countryList &&
                countryList.map(country => (
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
