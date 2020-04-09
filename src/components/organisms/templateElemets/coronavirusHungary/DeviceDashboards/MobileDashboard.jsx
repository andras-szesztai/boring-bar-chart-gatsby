import React from "react"
import styled, { css } from "styled-components"

import { MobileOnlyView, withOrientationChange } from "react-device-detect"
import { useOrientation } from "../../../../../hooks"
import { FlexContainer, GridContainer } from "../../../../atoms"

const MainGrid = styled(GridContainer)`
  width: 100%;

  ${({ orientation }) =>
    orientation === "landscape"
      ? css`
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(2, 80px) 150px 250px;
          grid-template-areas:
            "title title title source source"
            "total date date slider slider"
            "label barChart barChart stackedChart stackedChart"
            "mainChart mainChart mainChart mainChart mainChart";
        `
      : css`
          grid-template-columns: 1fr;
          grid-template-rows: 100px 50px 150px 100px 50px repeat(2, 200px) 600px;
          grid-template-areas:
            "title"
            "source"
            "slider"
            "date"
            "barChart"
            "percChart"
            "mainChart";
        `}
`

function MobileDashboard({ isLandscape, isPortrait }) {
  const orientation = useOrientation({ isLandscape, isPortrait })

  return (
    <MobileOnlyView>
      {orientation === "landscape" && (
        <MainGrid orientation="landscape">
          <FlexContainer withBorder gridArea="source" />
          <FlexContainer withBorder gridArea="title" />
          <FlexContainer withBorder gridArea="total" />
          <FlexContainer withBorder gridArea="date" />
          <FlexContainer withBorder gridArea="slider" />
          <FlexContainer withBorder gridArea="label" />
          <FlexContainer withBorder gridArea="barChart" />
          <FlexContainer withBorder gridArea="stackedChart" />
          <FlexContainer withBorder gridArea="mainChart" />
        </MainGrid>
      )}
      {orientation === "portrait" && (
        <MainGrid orientation="portrait">
          <FlexContainer withBorder />
          <FlexContainer withBorder />
          <FlexContainer withBorder />
          <FlexContainer withBorder />
          <FlexContainer withBorder />
          <FlexContainer withBorder />
          <FlexContainer withBorder />
          <FlexContainer withBorder />
        </MainGrid>
      )}
    </MobileOnlyView>
  )
}

export default withOrientationChange(MobileDashboard)
