import React from "react"
import { FlexContainer, Title } from "../../../../atoms"

export default function DashboardTitle({ isPortrait }) {
  return (
    <FlexContainer
      justify={isPortrait ? "center" : "flex-start"}
      fullSize
      gridArea="title"
    >
      <Title fontSize={3} fontWeight="medium">
        State of Waste in Europe
      </Title>
    </FlexContainer>
  )
}
