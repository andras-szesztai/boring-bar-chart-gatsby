import React, { useState } from "react"
import styled from "styled-components"
import { BrowserView } from "react-device-detect"
import { useSpring, animated as a, config, useTrail } from "react-spring"
import { format, subDays } from "date-fns"

import { GridContainer, FlexContainer } from "../../../../../atoms"
import { space, dropShadow } from "../../../../../../themes/theme"
import { TEXT } from "../../../../../../constants/visualizations/coronavirusHungary"

import SwitchContainer from "../../SwitchContainer/SwitchContainer"
import SourceLink from "../../SourceLink/SourceLink"
import Number from "../../Number/Number"
import { DateSliderBrowser, DateSlider } from "../../DateSlider/DateSlider"
import BarLabels from "../../BarLabels/BarLabels"
import HorizontalBarChart from "../../HorizontalBarChart/HorizontalBarChart"
import PercChartContainer from "../../PercChartContainer/PercChartContainer"
import AgeChartBrowser from "../../AgeChartBrowser/AgeChartBrowser"
import { FullScreenLoader } from "../../../../../molecules"
import FlippingCard from "../../FlippingCard/FlippingCard"
import { SwitchComponent } from "../../../../../molecules/controlElements"
import CurrDateContainer from "../../CurrDateContainer/CurrDateContainer"
import CardGrid from "../../CardGrid/CardGrid"

const BrowserMainGrid = styled(GridContainer)`
  max-width: 1400px;
  width: 94vw;
  margin: ${space[3]}px 0;

  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: minmax(120px, min-content) 70px 400px 400px;
  grid-row-gap: 3rem;
  grid-column-gap: 3rem;
  grid-template-areas:
    "title title title source"
    "control control control control"
    "cumulative daily age ratio"
    "main main main main";

  @media (max-width: 1000px) {
    grid-template-rows: minmax(120px, min-content) 70px 400px 400px 500px;
    grid-row-gap: 1.5rem;
    grid-column-gap: 1.5rem;
    grid-template-areas:
      "title title title source"
      "control control control control"
      "cumulative cumulative daily daily"
      "age age ratio ratio"
      "main main main main";
  }
`

const charts = [
  { gridArea: "cumulative", perspective: 700, zIndex: "hoverOverlay" },
  { gridArea: "daily", perspective: 700, zIndex: "hoverOverlay" },
  { gridArea: "age", perspective: 700, zIndex: "hoverOverlay" },
  { gridArea: "ratio", perspective: 700, zIndex: "hoverOverlay" },
  { gridArea: "main", perspective: 5000, zIndex: "none" },
]

const CARD_STYLE_PROPS = {
  withDropShadow: true,
  bgColor: "#ffffff",
  borderRadius: 1,
}

export default function BrowserDashboard({
  setLanguage,
  updateCurrDate,
  updateDisplay,
  state,
  dispatch,
}) {
  const {
    language,
    display,
    numbers,
    dates,
    loading,
    fullListDomain,
    dataSets: { filteredData },
  } = state
  const isGender = state.display === "gender"
  const trail = useTrail(charts.length, {
    config: { mass: 6, tension: 500, friction: 80 },
    opacity: isGender ? 1 : 0,
    transform: isGender ? 180 : 0,
  })

  return (
    <BrowserView>
      <FlexContainer bgColor="#f2f2f2">
        <BrowserMainGrid>
          <FlexContainer
            gridArea="title"
            fontSize={5}
            fontWeight="ultraLight"
            lineHeight={1.2}
            paddingBottom={2}
            textAlign="left"
          >
            {TEXT.mainTitle[language]}
          </FlexContainer>
          <GridContainer
            gridArea="source"
            bgColor="#f2f2f2"
            rowGap={2}
            marginRight={3}
          >
            <SwitchComponent
              language={language}
              onChange={() => setLanguage(dispatch)}
              isChecked={language === "en"}
              text={["Magyar", "English"]}
              justify="flex-end"
              align="flex-end"
            />
            <SourceLink
              language={language}
              justify="flex-end"
              align="flex-start"
            />
          </GridContainer>
          <GridContainer
            {...CARD_STYLE_PROPS}
            gridArea="control"
            columns="160px 1fr 25px 250px"
          >
            <CurrDateContainer
              language={language}
              currDate={state.dates.currDate}
              justify="center"
            />
            <DateSlider
              dates={dates}
              language={language}
              dispatch={dispatch}
              updateCurrDate={updateCurrDate}
            />
            <div />
            <SwitchComponent
              language={language}
              onChange={() => updateDisplay(dispatch)}
              isChecked={display === "gender"}
              text={TEXT.displayTest[language]}
              marginRight={3}
              justify="flex-end"
            />
          </GridContainer>
          {trail.map((trans, i) => {
            const area = charts[i].gridArea
            const isMain = area === "main"
            return (
              <FlippingCard
                key={area}
                toggle={isGender}
                transition={trans}
                fullCardIsClickable
                frontContent={
                  <CardGrid
                    area={area}
                    onlyChart={isMain}
                    title={TEXT.chartTitles[area].total[language]}
                    currDate={state.dates.currDate}
                    data={isMain ? filteredData : state.dataSets[area].total}
                    language={language}
                  />
                }
                backContent={
                  <CardGrid
                    area={area}
                    onlyChart={isMain}
                    title={TEXT.chartTitles[area].gender[language]}
                    currDate={state.dates.currDate}
                    data={isMain ? filteredData : state.dataSets[area].gender}
                    language={language}
                  />
                }
                {...charts[i]}
              />
            )
          })}
        </BrowserMainGrid>
      </FlexContainer>
    </BrowserView>
  )
}
