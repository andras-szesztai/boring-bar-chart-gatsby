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
  actions,
} from "../../../reducers/coronavirusDashboard/coronavirusDashboardReducer"

function CoronaVirusHungaryDashboard({ data, enData, loading }) {
  const [state, dispatch] = useReducer(
    coronavirusDashboardReducer,
    coronavirusDashboardInitialState
  )
  const prevState = usePrevious(state)

  const {
    setFormattedData,
    setLanguage,
    setInitialDates,
    setFilteredData,
    setNumbers,
    setAverages,
    setFullListDomain,
  } = actions

  useEffect(() => {
    if (data && !state.dataSets.formattedData) {
      setFormattedData(dispatch, { data: data })
      setInitialDates(dispatch)
      setFilteredData(dispatch)
      setNumbers(dispatch)
      setAverages(dispatch)
      setFullListDomain(dispatch)
    }
    if (prevState) {
      if (prevState.language !== state.language) {
        const currData = state.language === "en" ? enData : data
        setFormattedData(dispatch, { data: currData })
        setFilteredData(dispatch)
      }
      if (!_.isEqual(state.dates.currDate, prevState.dates.currDate)) {
        setFilteredData(dispatch)
        setNumbers(dispatch)
        setAverages(dispatch)
      }
    }
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
