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
import { StackedBarChart } from ".."

const MainGrid = styled(GridContainer)`
  margin-top: ${space[2]}px;
  margin-bottom: ${space[2]}px;
  width: 94%;
  ${({ orientation }) =>
    orientation === "landscape"
      ? css`
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: min-content 100px 150px 250px;
          grid-template-areas:
            "title title title source source"
            "total date date slider slider"
            "barChart barChart barChart stackedChart stackedChart"
            "mainChart mainChart mainChart mainChart mainChart";
        `
      : css`
          grid-template-columns: 1fr;
          grid-template-rows:
            min-content 70px 120px 80px 270px 175px
            600px;
          grid-template-areas:
            "title"
            "source"
            "slider"
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
          grid-template-columns: 1fr 2fr;
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
  grid-template-areas:
    "title title"
    "fem mal"
    "chart chart";
  ${({ orientation }) =>
    orientation === "landscape"
      ? css`
          grid-template-rows: 25px 35px 1fr;
          grid-template-columns: repeat(2, 1fr);
        `
      : css`
          grid-template-rows: 35px 65px 1fr;
          grid-template-columns: repeat(2, 1fr);
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
            fontSize={3}
            fontWeight="ultraLight"
            lineHeight={1.2}
          >
            {TEXT.mainTitle[language]}
          </FlexContainer>
          <FlexContainer
            gridArea="source"
            justify={isLS ? "space-evenly" : "space-around"}
            align={isLS && "flex-start"}
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
            extraPadding={!isLS && 4}
            extraPaddingRight={isLS && 2}
            isSticky={!isLS}
            loading={loading}
            dateFontSize={3}
            currDate={dates.currDate}
            fontWeight="ultraLight"
            justify={isLS ? "flex-start" : "center"}
          />
          <BanContainer
            gridArea="total"
            columns={isLS ? "repeat(2, 1fr)" : "1fr"}
            justify={isLS ? "flex-start" : "center"}
            text={TEXT.total[language]}
            numJustify={isLS && "flex-end"}
            number={numbers.total}
          />
          <BarChartContainer gridArea="barChart" orientation={orientation}>
            <BanContainer
              direction="column"
              columns={isLS ? "repeat(2, 1fr)" : "1fr"}
              justify={isLS ? "flex-start" : "center"}
              numJustify={isLS && "flex-end"}
              text={TEXT.genderF[language]}
              number={numbers.female}
              color={chartColors.female}
              withIcon={{ iconSize: 16 }}
            />
            <BanContainer
              direction="column"
              columns={isLS ? "repeat(2, 1fr)" : "1fr"}
              text={TEXT.genderM[language]}
              number={numbers.male}
              color={chartColors.male}
              numJustify={isLS && "flex-end"}
              withIcon={{ iconSize: 16 }}
              justify={isLS ? "flex-start" : "center"}
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
          <StackedChartContainer
            gridArea="stackedChart"
            orientation={orientation}
          >
            <FlexContainer
              fontSize={2}
              gridArea="title"
              justify={isLS ? "flex-start" : "center"}
            >
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
            <FlexContainer gridArea="chart">
              <StackedBarChart
                data={numbers}
                margin={{
                  top: isLS ? 14 : 5,
                  right: isLS ? 0 : 15,
                  bottom: isLS ? 16 : 5,
                  left: isLS ? 0 : 15,
                }}
              />
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
