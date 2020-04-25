import React, { useEffect, useReducer } from "react"
import Helmet from "react-helmet"
import _ from "lodash"

import { usePrevious, useDeviceType } from "../../../hooks"
import { TEXT } from "../../../constants/visualizations/coronavirusHungary"
import {
  BrowserDashboard,
} from "../../organisms/templateElemets/coronavirusHungary/DeviceDashboards"
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
    updateCurrDate,
    updateDisplay
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
        title={TEXT.helmet[state.language]}
      />
      {device === "desktop" && (
        <BrowserDashboard
        state={state}
        dispatch={dispatch}
        setLanguage={setLanguage}
        updateCurrDate={updateCurrDate}
        updateDisplay={updateDisplay}
        numbers={state.numbers}
        loading={loading}
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
