import React, { useState, useEffect } from "react"
import styled, { css } from "styled-components"
import { useTrail, useSpring } from "react-spring"
import { withOrientationChange } from "react-device-detect"

import { GridContainer, FlexContainer } from "../../../../../atoms"
import { space } from "../../../../../../themes/theme"
import {
  TEXT,
  chartColors,
} from "../../../../../../constants/visualizations/coronavirusHungary"

import SourceLink from "../../SourceLink/SourceLink"
import { DateSlider } from "../../DateSlider/DateSlider"
import { FullScreenLoader } from "../../../../../molecules"
import FlippingCard from "../../FlippingCard/FlippingCard"
import { SwitchComponent } from "../../../../../molecules/controlElements"
import CurrDateContainer from "../../CurrDateContainer/CurrDateContainer"
import CardGrid from "../../CardGrid/CardGrid"

const MobileMainGrid = styled(GridContainer)`
  ${({ orientation }) =>
    orientation === "landscape"
      ? css`
          width: 94%;
          margin-top: ${space[3]}px;
          margin-bottom: ${space[2]}px;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: min-content 70px repeat(3, 350px);
          grid-gap: 2rem;
          grid-template-areas:
            "title title title source"
            "control control control control"
            "cumulative cumulative daily daily"
            "age age ratio ratio"
            "main main main main";
        `
      : css`
          width: 92%;
          margin-top: ${space[2]}px;
          margin-bottom: ${space[4]}px;
          grid-template-columns: 1fr;
          grid-template-rows: min-content 50px 165px repeat(4, 380px) 780px;
          grid-template-areas:
            "title"
            "source"
            "control"
            "cumulative"
            "daily"
            "age"
            "ratio"
            "main";
        `}
`

const FilterContainer = styled(GridContainer)`
  ${({ isPortrait }) =>
    isPortrait
      ? css`
          padding: 1rem 3rem 2rem 3rem;
          grid-template-rows: min-content repeat(2, 50px);
        `
      : css`
          grid-column-gap: 2rem;
          grid-template-columns: min-content 1fr min-content;
        `}
`

const smallPerspective = 1600
const charts = [
  {
    gridArea: "cumulative",
    perspective: smallPerspective,
    zIndex: "hoverOverlay",
  },
  { gridArea: "daily", perspective: smallPerspective, zIndex: "hoverOverlay" },
  { gridArea: "age", perspective: smallPerspective, zIndex: "hoverOverlay" },
  { gridArea: "ratio", perspective: smallPerspective, zIndex: "hoverOverlay" },
  { gridArea: "main", perspective: 5000, zIndex: "none" },
]

const CARD_STYLE_PROPS = {
  withDropShadow: true,
  bgColor: "#ffffff",
  borderRadius: 1,
}

function MobileDashboard({
  setLanguage,
  updateCurrDate,
  updateDisplay,
  state,
  dispatch,
  loading,
  windowWidth,
  isBelowPosition,
  filterContainerRef,
  isPortrait,
  setCardClicked,
  filterTransitionProps,
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
    <FlexContainer bgColor={chartColors.bgColor}>
      <FullScreenLoader loader="clip" loading={loading} loaderSize={60} />
      <MobileMainGrid
        rowGap={isPortrait ? 4 : 3}
        orientation={isPortrait ? "portrait" : "landscape"}
      >
        <FlexContainer
          gridArea="title"
          fontSize={4}
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
          paddingLeft={isPortrait && 1}
          columns={isPortrait && "repeat(2, 1fr)"}
        >
          <SourceLink
            language={language}
            justify={isPortrait ? "center" : "flex-end"}
            paddingBottom={isPortrait && 1}
          />
          <SwitchComponent
            language={language}
            onChange={() => setLanguage(dispatch)}
            isChecked={language === "en"}
            text={["Magyar", "English"]}
            justify={isPortrait ? "center" : "flex-end"}
          />
        </GridContainer>
        <FilterContainer
          {...CARD_STYLE_PROPS}
          ref={filterContainerRef}
          isPortrait={isPortrait}
          style={filterTransitionProps}
          gridArea={!isBelowPosition && "control"}
          zIndex={isBelowPosition && "overlay"}
          height={!isPortrait ? "70px" : "165px"}
          fixedPos={
            isBelowPosition && {
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
            marginLeft={!isPortrait && 3}
          />
          <DateSlider
            dates={dates}
            language={language}
            dispatch={dispatch}
            updateCurrDate={updateCurrDate}
            direction={isPortrait && "column"}
            paddingRight={!isPortrait && 2}
            marginRight={!isPortrait && 3}
            paddingBottom={!isPortrait && 1}
          />
          <SwitchComponent
            language={language}
            onChange={() => {
              updateDisplay(dispatch)
              isBelowPosition && setCardClicked(true)
            }}
            isChecked={display === "gender"}
            text={TEXT.displayTest[language]}
            justify={isPortrait ? "center" : "flex-end"}
            marginRight={!isPortrait && 3}
            containerPaddingTop={!isPortrait && 2}
          />
        </FilterContainer>
        {trail.map((trans, i) => {
          const area = charts[i].gridArea
          const isMain = area === "main"
          return (
            <FlippingCard
              key={area}
              handleClick={() => isBelowPosition && setCardClicked(true)}
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
                  fullListDomain={state.fullListDomain}
                  isPortrait={isPortrait}
                  device="mobile"
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
                  fullListDomain={state.fullListDomain}
                  isPortrait={isPortrait}
                  type="back"
                  device="mobile"
                />
              }
              {...charts[i]}
            />
          )
        })}
      </MobileMainGrid>
    </FlexContainer>
  )
}

export default withOrientationChange(MobileDashboard)
