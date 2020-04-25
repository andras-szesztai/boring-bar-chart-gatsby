import React from "react"
import { GridContainer, FlexContainer } from "../../../../atoms"
import { space } from "../../../../../themes/theme"

export default function CardGrid({ onlyChart }) {
  return (
    <GridContainer
      style={{ padding: space[2] }}
      fullSize
      rows={onlyChart ? "50px 1fr" : "50px 1fr 100px"}
    >
      <FlexContainer withBorder>Title</FlexContainer>
      <FlexContainer withBorder>Chart</FlexContainer>
      {!onlyChart && <FlexContainer withBorder>Numbers</FlexContainer>}
    </GridContainer>
  )
}
