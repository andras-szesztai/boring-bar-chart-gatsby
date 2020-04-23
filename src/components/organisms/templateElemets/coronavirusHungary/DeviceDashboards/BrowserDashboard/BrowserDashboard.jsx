import React, { useState } from "react"
import styled from "styled-components"
import { BrowserView } from "react-device-detect"
import { useSpring, animated as a, config } from "react-spring"

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

const Flipping = styled(a.div)`
  position: absolute;
  width: 400px;
  height: 400px;
  cursor: pointer;
  will-change: transform, opacity;

  background-color: #fff;

  box-shadow: ${dropShadow.primary}, ${dropShadow.secondary};

  background-size: cover;
`

const SideBack = styled(Flipping)``

const SideFront = styled(Flipping)``

const BrowserMainGrid = styled(GridContainer)`
  max-width: 1400px;
  width: 94vw;

  max-height: 700px;
  min-height: 500px;
  height: 96vh;
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
  const [flipped, set] = useState(false)
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 8, tension: 500, friction: 80 },
  })


  return (
    <BrowserView>
        <BrowserMainGrid>

        </BrowserMainGrid>
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