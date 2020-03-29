import React from "react"
import { FlexContainer, Title } from "../../../../../atoms"

export default function DashboardTitle({ justify }) {
  return (
    <FlexContainer
      justify={justify ? justify : "flex-start"}
      fullSize
      gridArea="title"
    >
      <Title fontSize={3} fontWeight="medium">
        State of Waste in Europe
      </Title>
    </FlexContainer>
  )
}
