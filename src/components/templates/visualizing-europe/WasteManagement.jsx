import React from "react"

import { FlexContainer, GridContainer } from "../../atoms"
import { useWindowDimensions, useUniqValuesList } from "../../../hooks"

export default function WasteManagemetDashboard({ data, loading }) {
  const { windowWidth } = useWindowDimensions()
  const countryList = useUniqValuesList(data, "country", ["EU 28"])
  // console.log(windowWidth)
  console.log(countryList);

  return (
    <FlexContainer fullScreen>
      <GridContainer
        withBorder  
        height="90%"
        width="90% "
        maxWidth="1400px"
        minWidth="300px"
      >
      Auto
      </GridContainer>
    </FlexContainer>
  )
}
