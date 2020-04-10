import React from "react"
import styled, { css } from "styled-components"

import { MobileOnlyView, withOrientationChange } from "react-device-detect"
import { useOrientation, useScrollPosition } from "../../../../../hooks"
import { FlexContainer, GridContainer, Container } from "../../../../atoms"
import { FullScreenLoader } from "../../../../molecules"
import {
  TEXT,
  chartColors,
  lowOpacity,
} from "../../../../../constants/visualizations/coronavirusHungary"
import SwitchContainer from "../SwitchContainer/SwitchContainer"
import SourceLink from "../SourceLink/SourceLink"
import { space } from "../../../../../themes/theme"
import Number from "../Number/Number"
import { GoPrimitiveSquare } from "react-icons/go"
import BanContainer from "../BanContainer/BanContainer"

const MainGrid = styled(GridContainer)`
  margin-top: ${space[2]}px;
  margin-bottom: ${space[2]}px;
  ${({ orientation }) =>
    orientation === "landscape"
      ? css`
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
          width: 94%;
          grid-template-columns: 1fr;
          grid-template-rows:
            min-content 50px 150px repeat(2, 80px) 280px 180px
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

const BarChartContainer = styled(GridContainer)`
  ${({ orientation }) =>
    orientation === "landscape"
      ? css``
      : css`
          grid-template-rows: 80px 1fr;
          grid-template-columns: repeat(2, 1fr);
          grid-template-areas:
            "fem mal"
            "barC barC";
        `}
`

const StackedChartContainer = styled(GridContainer)`
  ${({ orientation }) =>
    orientation === "landscape"
      ? css``
      : css`
          grid-template-rows: 70px 1fr;
          grid-template-columns: repeat(2, 1fr);
          grid-template-areas:
            "fem mal"
            "barC barC";
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
  const scrollPosition = useScrollPosition()

  const isLS = orientation === "landscape"
  return (
    <MobileOnlyView>
      <FlexContainer fullSize pos="relative">
        <FullScreenLoader loading={loading} loader="clip" loaderSize={70} />
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
          <BanContainer
            direction="column"
            gridArea="total"
            justify={isLS ? "center" : "space-evenly"}
            align={isLS ? "flex-start" : "center"}
            text={TEXT.total[language]}
            number={numbers.total}
            numMarginTop={isLS && 1}
            numMarginBottom={!isLS && 1}
          />
          <BarChartContainer withBorder gridArea="barChart">
            <BanContainer
              direction="column"
              text={TEXT.genderF[language]}
              number={numbers.female}
              color={chartColors.female}
              withIcon={{ iconSize: 16 }}
              numMarginTop={isLS && 1}
            />
            <BanContainer
              direction="column"
              text={TEXT.genderM[language]}
              number={numbers.male}
              color={chartColors.male}
              withIcon={{ iconSize: 16 }}
              numMarginTop={isLS && 1}
            />
            <FlexContainer gridArea="barC" withBorder>
              BarChart
            </FlexContainer>
          </BarChartContainer>
          <FlexContainer withBorder gridArea="stackedChart" />
          <FlexContainer withBorder gridArea="mainChart" />
        </MainGrid>
      </FlexContainer>
    </MobileOnlyView>
  )
}

export default withOrientationChange(MobileDashboard)
