import React from 'react';

import styled from "styled-components"
import { GridContainer, withOrientationChange } from "../../../../atoms"

const MainGridLandScape = styled(GridContainer)`
  grid-template-rows: 1fr;
`

const MainGridPortrait =  styled(GridContainer)`
`


function DashboardMobileView({
  isPortrait
}){

  const MainGrid = isPortrait ? MainGridPortrait : MainGridLandScape
  return (
    <MainGrid>

    </MainGrid>
  )

}


export default withOrientationChange(DashboardMobileView)