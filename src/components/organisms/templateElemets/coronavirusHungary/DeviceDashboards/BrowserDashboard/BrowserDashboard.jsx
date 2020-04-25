import React, { useState } from "react"
import styled from "styled-components"
import { BrowserView } from "react-device-detect"
import { useSpring, animated as a, config, useTrail } from "react-spring"

import { GridContainer, FlexContainer } from "../../../../../atoms"
import { space, dropShadow } from "../../../../../../themes/theme"
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
import FlippingCard from "../../FlippingCard/FlippingCard"
import { SwitchComponent } from "../../../../../molecules/controlElements"
import CurrDateContainer from "../../CurrDateContainer/CurrDateContainer"

const BrowserMainGrid = styled(GridContainer)`
  max-width: 1400px;
  width: 94vw;
  margin: ${space[4]}px 0;

  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: minmax(120px, min-content) 100px 400px 400px;
  grid-row-gap: 3rem;
  grid-column-gap: 3rem;
  grid-template-areas:
    "title title title source"
    "control control control control"
    "cumulative daily age ratio"
    "main main main main";

  @media (max-width: 1000px) {
    grid-template-rows: minmax(120px, min-content) 100px 400px 400px 500px;
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
  state,
  dispatch,
}) {
  const {
    language,
    numbers,
    dates,
    loading,
    fullListDomain,
    dataSets: { filteredData },
  } = state
  const [toggle, set] = useState(false)
  const trail = useTrail(charts.length, {
    config: { mass: 6, tension: 500, friction: 80 },
    opacity: toggle ? 1 : 0,
    transform: toggle ? 180 : 0,
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
          <GridContainer gridArea="source" bgColor="#f2f2f2" rowGap={2}>
            <SwitchComponent
              language={language}
              onChange={() => setLanguage(dispatch)}
              isChecked={language === "en"}
              text={["Magyar", "English"]}
              justify="flex-end"
              align="flex-end"
              textMarginBottom={1}
              textSideMargin={2}
            />
            <SourceLink
              language={language}
              justify="flex-end"
              align="flex-start"
            />
          </GridContainer>
          <GridContainer gridArea="control" columns="min-content 1fr min-content" >
            <CurrDateContainer language={language} currDate={state.dates.currDate}/>
          </GridContainer>
          <FlexContainer
            {...CARD_STYLE_PROPS}
            gridArea="control"
            onClick={() => set(state => !state)}
          />
          {trail.map((trans, i) => (
            <FlippingCard
              key={charts[i].gridArea}
              toggle={toggle}
              transition={trans}
              fullCardIsClickable
              {...charts[i]}
            />
          ))}
        </BrowserMainGrid>
      </FlexContainer>
    </BrowserView>
  )
}

// {/* <FlexContainer fullScreen>
// <FullScreenLoader loading={loading} loader="clip" loaderSize={75} />
// <BrowserMainGrid>
//   <FlexContainer fontSize={2} justify="flex-start" gridArea="total">
//     {TEXT.total[language]}:
//   </FlexContainer>
//   <FlexContainer fontSize={3} fontWeight={3} gridArea="tNum">
//     <Number num={numbers.total} />
//   </FlexContainer>
//   <DateSliderBrowser
//     dates={dates}
//     language={language}
//     setDates={setDates}
//   />
//   <BarLabels numbers={numbers} language={language} />
//   <FlexContainer gridArea="barC" fullSize>
//     {!loading && (
//       <HorizontalBarChart
//         data={numbers}
//         fullListDomain={fullListDomain}
//       />
//     )}
//   </FlexContainer>
//   <PercChartContainer
//     language={language}
//     numbers={numbers}
//     loading={loading}
//   />
//   <FlexContainer gridArea="7/-1/-1/1" pos="relative">
//     <FlexContainer absPos top={space[2]} left={0} fontSize={2}>
//       {TEXT.mainChartExpBrowser[language]}
//     </FlexContainer>
//     {!loading && (
//       <AgeChartBrowser data={filteredData} language={language} />
//     )}
//   </FlexContainer>
// </BrowserMainGrid>
// </FlexContainer> */}
