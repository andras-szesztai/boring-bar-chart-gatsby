import React from "react"
import { withOrientationChange } from "react-device-detect"
import styled from "styled-components"

import { GridContainer } from "../../../../atoms"
import DashboardTitle from "../DashboardTitle/DashboardTitle"
import DashboardExplainer from "../DashboardExplainer/DashboardExplainer"
import SwitchContainer from "../SwitchContainer/SwitchContainer"
import BigChartsContainer from "../BigChartsContainer/BigChartsContainer"
import SubChartsContainer from "../SubChartsContainer/SubChartsContainer"

const MainGridLandScape = styled(GridContainer)`
  width: 96%;
  height: 95%;
  grid-column-gap: 3rem;
  grid-template-columns: 1fr 2fr;
  grid-template-areas: "mainCharts subCharts";
`

const MainChartsContainerLandScape = styled(GridContainer)`
  grid-template-rows: min-content 0.5fr repeat(2, 3fr);
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    "title helper"
    "switch switch"
    "chartOne chartOne"
    "chartTwo chartTwo";
`

const MainGridPortrait = styled(GridContainer)`
  width: 92%;
  height: 95%;
  grid-template-rows: 3fr 5fr;
  grid-row-gap: 3rem;
  grid-template-areas:
    "mainCharts"
    "subCharts";
`

const MainChartsContainerPortrait = styled(GridContainer)`
  grid-template-rows: repeat(2, 1fr) 6fr;
  grid-column-gap: 4rem;
  grid-row-gap: 2rem;
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    "title helper"
    "switch switch"
    "chartOne chartTwo";
`

function DashboardTabletView({
  isPortrait,
  metric,
  setMetric,
  data,
  countryList,
  selectedCountry,
  setSelectedCountry,
}) {
  const MainGrid = isPortrait ? MainGridPortrait : MainGridLandScape
  const MainChartsGrid = isPortrait
    ? MainChartsContainerPortrait
    : MainChartsContainerLandScape
  return (
    <MainGrid>
      <MainChartsGrid fullSize gridArea="mainCharts">
        <DashboardTitle />
        <DashboardExplainer />
        <SwitchContainer
          metric={metric}
          setMetric={setMetric}
          justify="flex-start"
        />
        <BigChartsContainer
          metric={metric}
          data={data}
          countryList={countryList}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
      </MainChartsGrid>
      <SubChartsContainer
        metric={metric}
        data={data}
        countryList={countryList}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
    </MainGrid>
  )
}

export default withOrientationChange(DashboardTabletView)
