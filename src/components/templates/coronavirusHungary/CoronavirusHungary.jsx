import React, { useState, useEffect, useRef, useReducer } from "react"
import { TabletView } from "react-device-detect"
import Helmet from "react-helmet"
import { differenceInDays } from "date-fns"
import _ from "lodash"
import { GoTools } from "react-icons/go"
import { min, max } from "d3-array"
import styled from "styled-components"

import { FlexContainer, Container } from "../../atoms"
import { usePrevious, useDeviceType } from "../../../hooks"
import { TEXT } from "../../../constants/visualizations/coronavirusHungary"
import {
  BrowserDashboard,
  MobileDashboard,
} from "../../organisms/templateElemets/coronavirusHungary/DeviceDashboards"
import SwitchContainer from "../../organisms/templateElemets/coronavirusHungary/SwitchContainer/SwitchContainer"
import {
  makeAreaData,
  filterGender,
} from "../../organisms/templateElemets/coronavirusHungary/utils/dataHelpers"
import { dropShadow, colors } from "../../../themes/theme"
import {
  coronavirusDashboardReducer,
  coronavirusDashboardInitialState,
} from "../../../reducers/coronavirusDashboard/coronavirusDashboardReducer"


function CoronaVirusHungaryDashboard({ data, enData, loading }) {
  const [state, dispatch] = useReducer(
    coronavirusDashboardReducer,
    coronavirusDashboardInitialState
  )
  const prevState = usePrevious(state)

  useEffect(() => {
    // if (data && !formattedData) {
    //   const formattedData = makeFormattedData({ data, isHu: true })
    //   const maxDate = _.maxBy(formattedData, "date").date
    //   const minDate = _.minBy(formattedData, "date").date
    //   const dateDiff = differenceInDays(minDate, maxDate)
    //   const femaleData = filterGender({
    //     accessor: "accessorF",
    //     language,
    //     data: formattedData,
    //   })
    //   const maleData = filterGender({
    //     accessor: "accessorM",
    //     language,
    //     data: formattedData,
    //   })
    //   const fullAgeDomain = [
    //     min(formattedData, ({ age }) => age) - 2,
    //     max(formattedData, ({ age }) => age) + 2,
    //   ].sort()
    //   const fullAgeList = []
    //   for (var i = fullAgeDomain[0]; i <= fullAgeDomain[1]; i++) {
    //     fullAgeList.push(i)
    //   }
    //   const maxNumber = max([
    //     ...makeAreaData(femaleData, fullAgeList).map(({ number }) => number),
    //     ...makeAreaData(maleData, fullAgeList).map(({ number }) => number),
    //   ])
    //   const maxGenderNumber = max([femaleData.length, maleData.length])
    //   setAverages(makeAverages(formattedData, language))
    //   setFullListDomain({
    //     fullAgeDomain,
    //     fullAgeList,
    //     maxNumber,
    //     maxGenderNumber,
    //   })
    //   setFormattedData(formattedData)
    //   setFilteredData(formattedData)
    //   setNumbers(makeNumbers(formattedData, language))
    //   setDates({
    //     diff: dateDiff,
    //     max: maxDate,
    //     currDate: maxDate,
    //   })
    // }
    // if (prevLanguage && language !== prevLanguage) {
    //   const isHu = language === "hu"
    //   const dataSet = isHu ? data : enData
    //   const formattedData = makeFormattedData({ data: dataSet, isHu })
    //   setFormattedData(formattedData)
    //   setFilteredData(
    //     formattedData.filter(
    //       ({ date }) => date.getTime() <= dates.currDate.getTime()
    //     )
    //   )
    // }
    // if (
    //   prevDates &&
    //   prevDates.currDate &&
    //   !_.isEqual(dates.currDate, prevDates.currDate)
    // ) {
    //   const filteredData = formattedData.filter(
    //     ({ date }) => date.getTime() <= dates.currDate.getTime()
    //   )
    //   setAverages(makeAverages(filteredData, language))
    //   setFilteredData(filteredData)
    //   setNumbers(makeNumbers(filteredData, language))
    // }
  })

  const device = useDeviceType()

  return (
    <>
      <Helmet
      // title={TEXT.helmet[language]}
      />
      {device === "desktop" && (
        <BrowserDashboard
        // language={language}
        // setLanguage={setLanguage}
        // numbers={numbers}
        // dates={dates}
        // setDates={setDates}
        // filteredData={filteredData}
        // loading={loading}
        // fullListDomain={fullListDomain}
        />
      )}
      {/* {device === "tablet" && (
        <TabletView>
          <FlexContainer
            fullSize
            height="100vh"
            fontSize={4}
            textAlign="center"
            direction="column"
          >
            <SwitchContainer
              language={language}
              setLanguage={setLanguage}
              paddingBottom={4}
            />
            {TEXT.tabletExp[language]}
            <Container paddingTop={5}>
              <GoTools size={40} />
            </Container>
          </FlexContainer>
        </TabletView>
      )}
      {device === "mobile" && (
        <MobileDashboard
          language={language}
          setLanguage={setLanguage}
          numbers={numbers}
          averages={averages}
          dates={dates}
          setDates={setDates}
          filteredData={filteredData}
          loading={loading}
          fullListDomain={fullListDomain}
        />
      )} */}
    </>
  )
}

export default CoronaVirusHungaryDashboard
