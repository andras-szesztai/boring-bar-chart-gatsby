import React from "react"
import styled from "styled-components"
import { useTrail } from "react-spring"

import { GridContainer, FlexContainer } from "../../../../../atoms"
import { space } from "../../../../../../themes/theme"
import { TEXT } from "../../../../../../constants/visualizations/coronavirusHungary"

import SourceLink from "../../SourceLink/SourceLink"
import { DateSlider } from "../../DateSlider/DateSlider"
import { FullScreenLoader } from "../../../../../molecules"
import FlippingCard from "../../FlippingCard/FlippingCard"
import { SwitchComponent } from "../../../../../molecules/controlElements"
import CurrDateContainer from "../../CurrDateContainer/CurrDateContainer"
import CardGrid from "../../CardGrid/CardGrid"

const BrowserMainGrid = styled(GridContainer)`
  max-width: 1400px;
  width: 94vw;
  margin: ${space[3]}px 0 ${space[5]}px 0;

  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: minmax(120px, min-content) 70px 400px 400px;
  grid-gap: 3rem;
  grid-template-areas:
    "title title title source"
    "control control control control"
    "cumulative daily age ratio"
    "main main main main";

  @media (max-width: 1024px) {
    grid-template-rows: minmax(120px, min-content) 70px 400px 400px 500px;
    grid-gap: 2em;
    grid-template-areas:
      "title title title source"
      "control control control control"
      "cumulative cumulative daily daily"
      "age age ratio ratio"
      "main main main main";
  }
`

const FilterContainer = styled(GridContainer)`
  grid-template-columns: min-content 1fr min-content;
  grid-column-gap: 3rem;
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
  loading,
  windowWidth,
  isBelowPosition,
  filterContainerRef,
  device
}) {
  const {
    language,
    display,
    dates,
    dataSets: { filteredData },
  } = state

  const isGender = state.display === "gender"
  const trail = useTrail(charts.length, {
    config: { mass: 6, tension: 500, friction: 80 },
    transform: isGender ? 180 : 0,
  })



  return (
      <FlexContainer bgColor="#f2f2f2" loader="circle" loaderSize={20}>
        <FullScreenLoader loading={loading} />
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
          <FilterContainer
            {...CARD_STYLE_PROPS}
            ref={filterContainerRef}
            gridArea={!isBelowPosition && "control"}
            zIndex={isBelowPosition && "overlay"}
            height="70px"
            fixedPos={
              isBelowPosition && {
                top: 0,
                left: 0,
                width: `${windowWidth * 0.94}px`,
                marginLeft: "3%",
                marginTop: space[3],
              }
            }
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
            <SwitchComponent
              language={language}
              onChange={() => updateDisplay(dispatch)}
              isChecked={display === "gender"}
              text={TEXT.displayTest[language]}
              marginRight={3}
              justify="flex-end"
            />
          </FilterContainer>
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
                    type="front"
                    device={device}
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
                    device={device}
                    fullListDomain={state.fullListDomain}
                    type="back"
                  />
                }
                {...charts[i]}
              />
            )
          })}
        </BrowserMainGrid>
      </FlexContainer>
  )
}
