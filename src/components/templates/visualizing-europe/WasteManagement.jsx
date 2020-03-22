import React from "react"
import styled from "styled-components"

import { FlexContainer, GridContainer } from "../../atoms"
import { useWindowDimensions, useUniqValuesList } from "../../../hooks"

const MainGrid = styled(GridContainer)`
  @media (min-width: 300px) {
    background-color: yellow;
  }
  @media (min-width: 600px) {
    background-color: blue;
  }
  @media (min-width: 1400px) {
    background-color: red;
  }

  @media only screen and (max-device-width: 1366px) and (orientation: landscape) {
    background-color: blue;
  }
  @media only screen and (max-device-width: 1024px) and (orientation: portrait) {
    background-color: pink;
  }

  @media only screen and (max-device-width: 820px) and (orientation: landscape) {
    background-color: green;
  }
  @media only screen and (max-device-width: 480px) and (orientation: portrait) {
    height: 92.5%;
  }
`

export default function WasteManagemetDashboard({ data, loading }) {
  const { windowWidth } = useWindowDimensions()
  const countryList = useUniqValuesList(data, "country", ["EU 28"])
  console.log(windowWidth)

  return (
    <FlexContainer fullScreen>
      <MainGrid
        withBorder
        width="92.5% "
        maxWidth="1400px"
        minWidth="300px"
      >
        Auto
      </MainGrid>
    </FlexContainer>
  )
}
