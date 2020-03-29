import React from "react"
import { withOrientationChange } from "react-device-detect"
import styled from "styled-components"

import { GridContainer } from "../../../../atoms"
import DashboardTitle from "../DashboardTitle/DashboardTitle"
import DashboardExplainer from "../DashboardExplainer/DashboardExplainer"
import SwitchContainer from "../SwitchContainer/SwitchContainer"
import BigChartsContainer from "../BigChartsContainer/BigChartsContainer"

const MainGridLandScape = styled(GridContainer)`
  width: 95%;
  height: 98%;
  grid-template-rows: 1fr 1fr 6fr;
  grid-column-gap: 3rem;
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    "title helper"
    "switch ."
    "chartOne chartTwo";
`

const MainGridPortrait = styled(GridContainer)`
  width: 95%;
  height: 95%;
  grid-template-rows: 1fr 0.5fr 1fr repeat(2, 5fr);
  grid-template-areas:
    "title"
    "helper"
    "switch"
    "chartOne"
    "chartTwo";
`

function DashboardMobileView({
  isPortrait,
  metric,
  setMetric,
  data,
  countryList,
  selectedCountry,
  setSelectedCountry,
}) {
  const MainGrid = isPortrait ? MainGridPortrait : MainGridLandScape
  return (
    <MainGrid>
      <DashboardTitle justify={isPortrait && "center"} />
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
    </MainGrid>
  )
}

export default withOrientationChange(DashboardMobileView)
