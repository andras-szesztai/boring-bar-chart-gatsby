import React from "react"
import styled from "styled-components"
import { BrowserView } from "react-device-detect"

import { GridContainer, FlexContainer } from "../../../../../atoms"
import { space } from "../../../../../../themes/theme"
import { TEXT } from "../../../../../../constants/visualizations/coronavirusHungary"

import SwitchContainer from "../../SwitchContainer/SwitchContainer"
import SourceLink from "../../SourceLink/SourceLink"
import Number from "../../Number/Number"
import { DateSliderBrowser } from "../../DateSlider/DateSlider"
import BarLabels from "../../BarLabels/BarLabels"
import HorizontalBarChart from "../../HorizontalBarChart/HorizontalBarChart"
import PercChartContainer from "../../PercChartContainer/PercChartContainer"
import AgeChartBrowser from "../../AgeChartBrowser/AgeChartBrowser"
import { FullScreenLoader } from "../../../../../molecules"

const BrowserMainGrid = styled(GridContainer)`
  max-width: 1400px;
  width: 94vw;

  max-height: 700px;
  min-height: 500px;
  height: 96vh;

  grid-template-columns: repeat(10, 5fr);
  grid-template-rows: repeat(2, min-content) repeat(11, 1fr);
  grid-row-gap: ${space[1]}px;
  grid-column-gap: ${space[1]}px;
  grid-template-areas:
    "title title title title title title source source source source"
    "total tNum . . . . dateSlider dateSlider dateSlider dateSlider"
    "no noNum barC barC barC barC percText percText percText percText"
    "no noNum barC barC barC barC percNo percNo percFfi percFfi"
    "ffi ffiNum barC barC barC barC percBar percBar percBar percBar"
    "ffi ffiNum barC barC barC barC percBar percBar percBar percBar";
`

export default function BrowserDashboard({
  language,
  setLanguage,
  numbers,
  dates,
  setDates,
  filteredData,
  loading,
  fullListDomain,
}) {
  return (
    <BrowserView>
      <FlexContainer fullScreen>
        <FullScreenLoader loading={loading} loader="clip" loaderSize={75} />
        <BrowserMainGrid>
          <FlexContainer
            gridArea="title"
            justify="flex-start"
            fontSize={4}
            fontWeight="ultraLight"
            lineHeight={1.2}
            paddingBottom={2}
          >
            {TEXT.mainTitle[language]}
          </FlexContainer>
          <FlexContainer
            gridArea="source"
            justify="space-around"
            align="flex-end"
            direction="column"
          >
            <SwitchContainer language={language} setLanguage={setLanguage} />
            <SourceLink language={language} />
          </FlexContainer>
          <FlexContainer fontSize={2} justify="flex-start" gridArea="total">
            {TEXT.total[language]}:
          </FlexContainer>
          <FlexContainer fontSize={3} fontWeight={3} gridArea="tNum">
            <Number num={numbers.total} />
          </FlexContainer>
          <DateSliderBrowser
            dates={dates}
            language={language}
            setDates={setDates}
          />
          <BarLabels numbers={numbers} language={language} />
          <FlexContainer gridArea="barC" fullSize>
            {!loading && (
              <HorizontalBarChart
                data={numbers}
                fullListDomain={fullListDomain}
              />
            )}
          </FlexContainer>
          <PercChartContainer
            language={language}
            numbers={numbers}
            loading={loading}
          />
          <FlexContainer gridArea="7/-1/-1/1" pos="relative">
            <FlexContainer absPos top={space[2]} left={0} fontSize={2}>
              {TEXT.mainChartExpBrowser[language]}
            </FlexContainer>
            {!loading && (
              <AgeChartBrowser data={filteredData} language={language} />
            )}
          </FlexContainer>
        </BrowserMainGrid>
      </FlexContainer>
    </BrowserView>
  )
}
