import React from "react"
import styled, { css } from "styled-components"

import { MobileOnlyView, withOrientationChange } from "react-device-detect"
import { useOrientation } from "../../../../../hooks"
import { FlexContainer, GridContainer } from "../../../../atoms"
import { FullScreenLoader } from "../../../../molecules"
import { TEXT } from "../../../../../constants/visualizations/coronavirusHungary"
import SwitchContainer from "../SwitchContainer/SwitchContainer"
import SourceLink from "../SourceLink/SourceLink"
import { space } from "../../../../../themes/theme"

const MainGrid = styled(GridContainer)`
  ${({ orientation }) =>
    orientation === "landscape"
      ? css`
          margin-top: ${space[2]}px;
          width: 96%;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: min-content 80px 150px 250px;
          grid-template-areas:
            "title title title source source"
            "total date date slider slider"
            "barChart barChart barChart stackedChart stackedChart"
            "mainChart mainChart mainChart mainChart mainChart";
        `
      : css`
          margin-top: ${space[3]}px;
          width: 94%;
          grid-template-columns: 1fr;
          grid-template-rows:
            min-content 50px 150px repeat(2, 50px) repeat(2, 200px)
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

  const isLS = orientation === "landscape"
  return (
    <MobileOnlyView>
      <FullScreenLoader loading={loading} loader="clip" loaderSize={70} />
      <FlexContainer fullSize>
        <MainGrid orientation={orientation} pos="relative">
          <FlexContainer
            gridArea="title"
            justify="flex-start"
            fontSize={3}
            fontWeight="ultraLight"
            lineHeight={1.1}
          >
            {TEXT.mainTitle[language]}
          </FlexContainer>
          <FlexContainer
            gridArea="source"
            justify={isLS ? "space-evenly" : "space-around"}
            align={isLS && "flex-end"}
            direction={isLS && "column"}
          >
            <SourceLink fontSize={1} language={language} />
            <SwitchContainer
              fontSize={1}
              language={language}
              setLanguage={setLanguage}
              switchWidth={32}
            />
          </FlexContainer>
          <FlexContainer withBorder gridArea="slider" />
          <FlexContainer withBorder gridArea="date" />
          <FlexContainer withBorder gridArea="total" />
          <FlexContainer withBorder gridArea="barChart" />
          <FlexContainer withBorder gridArea="stackedChart" />
          <FlexContainer withBorder gridArea="mainChart" />
        </MainGrid>
      </FlexContainer>
    </MobileOnlyView>
  )
}

export default withOrientationChange(MobileDashboard)
