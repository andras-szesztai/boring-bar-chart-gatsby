import React from "react"
import { withOrientationChange } from "react-device-detect"
import styled from "styled-components"

import { GridContainer } from "../../../../atoms"
import DashboardTitle from "../DashboardTitle/DashboardTitle"
import DashboardExplainer from "../DashboardExplainer/DashboardExplainer"
import SwitchContainer from "../SwitchContainer/SwitchContainer"

const MainGridLandScape = styled(GridContainer)`
  grid-template-rows: 1fr 1fr 3fr;
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    "title helper"
    "switch ."
    "chartOne chartTwo";
`

const MainGridPortrait = styled(GridContainer)`
  grid-template-rows: 1fr 1fr 1fr repeat(2, 5fr);
  grid-template-areas:
    "title"
    "helper"
    "switch"
    "chartOne"
    "chartTwo";
`

function DashboardMobileView({ isPortrait, metric, setMetric }) {
  const MainGrid = isPortrait ? MainGridPortrait : MainGridLandScape
  return (
    <MainGrid fullSize>
      <DashboardTitle isPortrait={isPortrait} />
      <DashboardExplainer />
      <SwitchContainer metric={metric} setMetric={setMetric} />
    </MainGrid>
  )
}

export default withOrientationChange(DashboardMobileView)
