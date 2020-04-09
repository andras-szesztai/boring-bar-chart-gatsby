import React from "react"
import styled, { css } from "styled-components"

import { MobileOnlyView, withOrientationChange } from "react-device-detect"
import { useOrientation } from "../../../../../hooks"
import { FlexContainer, GridContainer } from "../../../../atoms"
import { FullScreenLoader } from "../../../../molecules"

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
            "barChart barChart barChart stackedChart stackedChart"
            "mainChart mainChart mainChart mainChart mainChart";
        `
      : css`
          grid-template-columns: 1fr;
          grid-template-rows:
            100px 50px 150px repeat(2, 50px) repeat(2, 200px)
            600px;
          grid-template-areas:
            "title"
            "source"
            "slider"
            "date"
            "total"
            "barChart"
            "stackedChart"
            "mainChart";
        `}
`

function MobileDashboard({
  isLandscape,
  isPortrait,
  language,
  setLanguage,
  numbers,
  dates,
  setDates,
  filteredData,
  loading,
}) {
  const orientation = useOrientation({ isLandscape, isPortrait })

  return (
    <MobileOnlyView>
      <MainGrid orientation={orientation} pos="relative">
        <FullScreenLoader loading={loading} loader="clip" loaderSize={70} />
        <FlexContainer withBorder gridArea="title" />
        <FlexContainer withBorder gridArea="source" />
        <FlexContainer withBorder gridArea="slider" />
        <FlexContainer withBorder gridArea="date" />
        <FlexContainer withBorder gridArea="total" />
        <FlexContainer withBorder gridArea="barChart" />
        <FlexContainer withBorder gridArea="stackedChart" />
        <FlexContainer withBorder gridArea="mainChart" />
      </MainGrid>
    </MobileOnlyView>
  )
}

export default withOrientationChange(MobileDashboard)
