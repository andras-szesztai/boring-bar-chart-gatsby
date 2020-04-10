import React from "react"
import styled, { css } from "styled-components"
import { FaArrowAltCircleDown } from "react-icons/fa"
import { GoPrimitiveSquare } from "react-icons/go"
import { MobileOnlyView, withOrientationChange } from "react-device-detect"

import {
  useOrientation,
  useScrollPosition,
  useWindowDimensions,
} from "../../../../../hooks"
import { FlexContainer, GridContainer } from "../../../../atoms"
import { FullScreenLoader, ScrollHint } from "../../../../molecules"
import {
  TEXT,
  chartColors,
  lowOpacity,
} from "../../../../../constants/visualizations/coronavirusHungary"
import SwitchContainer from "../SwitchContainer/SwitchContainer"
import SourceLink from "../SourceLink/SourceLink"
import { space, colors } from "../../../../../themes/theme"
import BanContainer from "../BanContainer/BanContainer"
import DateSlider from "../DateSlider/DateSlider"
import CurrDateContainer from "../CurrDateContainer/CurrDateContainer"
import HorizontalBarChart from "../HorizontalBarChart/HorizontalBarChart"
import PercChartContainer from "../PercChartContainer/PercChartContainer"
import Number from "../Number/Number"

const MainGrid = styled(GridContainer)`
  margin-top: ${space[2]}px;
  margin-bottom: ${space[2]}px;
  width: 94%;
  ${({ orientation }) =>
    orientation === "landscape"
      ? css`
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: min-content 80px 150px 250px;
          grid-template-areas:
            "title title title source source"
            "total date date slider slider"
            "barChart barChart barChart stackedChart stackedChart"
            "mainChart mainChart mainChart mainChart mainChart";
        `
      : css`
          grid-template-columns: 1fr;
          grid-template-rows:
            min-content repeat(4, 80px) 270px 175px
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
      ? css`
          grid-template-columns: 100px 1fr;
          grid-template-rows: repeat(2, 1fr);
          grid-template-areas:
            "fem barC"
            "mal barC";
        `
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
          margin-top: ${space[2]}px;
          grid-template-rows: repeat(2, 45px) 1fr;
          grid-template-columns: repeat(2, 1fr);
          grid-template-areas:
            "title title"
            "fem mal"
            "chart chart";
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
            <SourceLink paddingBottom={1} fontSize={1} language={language} />
            <SwitchContainer
              fontSize={1}
              language={language}
              setLanguage={setLanguage}
              switchWidth={32}
            />
          </FlexContainer>
          <DateSlider
            language={language}
            dates={dates}
            setDates={setDates}
            fontSize={2}
            extraPadding={!isLS && 3}
            extraPaddingRight={isLS && 2}
            justify="space-evenly"
            direction="column"
            textPaddingBottom={!isLS && 2}
            textPaddingRightTop={isLS && 1}
            sliderPaddingTop={2}
            isSticky={!isLS}
          />
          <CurrDateContainer
            fontSize={2}
            dateFontSize={3}
            language={language}
            currDate={dates.currDate}
            direction="column"
            fontWeight="ultraLight"
          />
          <BanContainer
            direction="column"
            gridArea="total"
            justify={isLS ? "center" : "space-evenly"}
            align={isLS ? "flex-start" : "center"}
            text={TEXT.total[language]}
            number={numbers.total}
            numMarginTop={isLS && 1}
          />
          <BarChartContainer gridArea="barChart" orientation={orientation}>
            <BanContainer
              direction="column"
              text={TEXT.genderF[language]}
              number={numbers.female}
              color={chartColors.female}
              withIcon={{ iconSize: 16 }}
              numMarginTop={!isLS && 1}
              align={isLS ? "flex-start" : "center"}
            />
            <BanContainer
              direction="column"
              text={TEXT.genderM[language]}
              number={numbers.male}
              color={chartColors.male}
              withIcon={{ iconSize: 16 }}
              numMarginTop={!isLS && 1}
              align={isLS ? "flex-start" : "center"}
            />
            <FlexContainer gridArea="barC">
              <HorizontalBarChart
                data={numbers}
                margin={{
                  top: isLS ? 5 : 10,
                  right: isLS ? 15 : 10,
                  bottom: isLS ? 5 : 10,
                  left: isLS ? 20 : 10,
                }}
              />
            </FlexContainer>
          </BarChartContainer>
          <StackedChartContainer gridArea="stackedChart">
            <FlexContainer fontSize={2} gridArea="title">
              {TEXT.genderPerc[language]}
            </FlexContainer>
            <FlexContainer
              gridArea="fem"
              fontWeight={3}
              fontSize={3}
              fontColor={chartColors.female}
            >
              {numbers.total && (
                <Number num={numbers.female / numbers.total} isPercentage />
              )}
            </FlexContainer>
            <FlexContainer
              gridArea="mal"
              fontWeight={3}
              fontSize={3}
              fontColor={chartColors.male}
            >
              {numbers.total && (
                <Number num={numbers.male / numbers.total} isPercentage />
              )}
            </FlexContainer>
          </StackedChartContainer>
          <FlexContainer withBorder gridArea="mainChart" />
          <ScrollHint opacity={lowOpacity} size={50} />
        </MainGrid>
      </FlexContainer>
    </MobileOnlyView>
  )
}

export default withOrientationChange(MobileDashboard)
