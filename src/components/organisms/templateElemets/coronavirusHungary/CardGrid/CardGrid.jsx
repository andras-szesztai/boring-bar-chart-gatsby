import React from "react"
import { GridContainer, FlexContainer } from "../../../../atoms"
import { space } from "../../../../../themes/theme"

export default function CardGrid({ onlyChart, title }) {
  return (
    <GridContainer
      style={{ padding: space[2] }}
      fullSize
      rows={onlyChart ? "50px 1fr" : "50px 1fr 100px"}
    >
      <FlexContainer withBorder>{title}</FlexContainer>
      <FlexContainer withBorder>Chart</FlexContainer>
      {!onlyChart && <FlexContainer withBorder>Numbers</FlexContainer>}
    </GridContainer>
  )
}
