import React, { useState } from "react"
import {
  MobileView,
  BrowserView,
  withOrientationChange,
  isMobile,
  isMobileOnly,
  isTablet,
  isBrowser,
} from "react-device-detect"

import { FlexContainer, GridContainer } from "../../atoms"
import { useWindowDimensions } from "../../../hooks"
import {
  styledComponents,
  TitleContainer,
  SmallChartContainer,
  BigChartsContainer,
} from "../../organisms/templateElemets/wasteManagementDashboard"
import { FullScreenLoader } from "../../molecules"
import { DashboardMobileView } from "../../organisms/templateElemets/wasteManagementDashboard/views"
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
    (windowHeight <= 800 && windowWidth <= 850)
  ) {
    isSmallScreen = true
  }

  return (
    <>
      <FlexContainer fullScreen>
        <FullScreenLoader loading={loading} />
        {isMobileOnly && <DashboardMobileView metric={metric} setMetric={setMetric}/>}
        {/* <MainGrid maxWidth="1400px">
          <MainChartsContainer>
            <TitleContainer
              metric={metric}
              setMetric={setMetric}
              isSmallScreen={isSmallScreen}
            />
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
        </MainGrid> */}
      </FlexContainer>
    </>
  )
}
