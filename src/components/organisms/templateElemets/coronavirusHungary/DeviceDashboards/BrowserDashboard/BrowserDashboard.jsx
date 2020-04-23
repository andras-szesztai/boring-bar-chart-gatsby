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

const BrowserMainGrid = styled(GridContainer)`
  max-width: 1400px;
  width: 94vw;
  margin: ${space[4]}px 0;

  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 120px 100px 400px 400px;
  grid-row-gap: 2rem;
  grid-column-gap: 2rem;
  grid-template-areas:
    "title title title source"
    "control control control control"
    "cumulative daily age ratio"
    "main main main main";
`

const charts = [
  { area: "cumulative", perspective: 600, zIndex: "hoverOverlay" },
  { area: "daily", perspective: 600, zIndex: "hoverOverlay" },
  { area: "age", perspective: 600, zIndex: "hoverOverlay" },
  { area: "ratio", perspective: 600, zIndex: "hoverOverlay" },
  { area: "main", perspective: 800, zIndex: "none" },
]

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
  const [toggle, set] = useState(false)
  const trail = useTrail(charts.length, {
    config: { mass: 6, tension: 500, friction: 80 },
    opacity: toggle ? 1 : 0,
    transform: toggle ? 180 : 0,
  })

  return (
    <BrowserView>
      <FlexContainer bgColor="#f2f2f2" fullSize>
        <BrowserMainGrid>
          <FlexContainer withBorder gridArea="title" />
          <FlexContainer withBorder gridArea="source" />
          <FlexContainer
            withBorder
            gridArea="control"
            onClick={() => set(state => !state)}
          />
          {trail.map((trans, i) => (
            <FlippingCard
              key={charts[i].area}
              gridArea={charts[i].area}
              toggle={toggle}
              transition={trans}
              front="Front"
              back="Back"
              styleProps={...charts[i].area}
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
//   <FlexContainer
//     gridArea="title"
//     justify="flex-start"
//     fontSize={4}
//     fontWeight="ultraLight"
//     lineHeight={1.2}
//     paddingBottom={2}
//   >
//     {TEXT.mainTitle[language]}
//   </FlexContainer>
//   <FlexContainer
//     gridArea="source"
//     justify="space-around"
//     align="flex-end"
//     direction="column"
//   >
//     <SwitchContainer language={language} setLanguage={setLanguage} />
//     <SourceLink language={language} />
//   </FlexContainer>
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
