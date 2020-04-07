import React, { useState, useEffect } from "react"
import {
  MobileOnlyView,
  TabletView,
  withOrientationChange,
} from "react-device-detect"
import { differenceInDays } from "date-fns"
import _ from "lodash"
import { GoTools } from "react-icons/go"
import { FlexContainer, Container } from "../../atoms"
import { usePrevious } from "../../../hooks"
import { TEXT } from "../../../constants/visualizations/coronavirusHungary"
import { BrowserDashboard } from "../../organisms/templateElemets/coronavirusHungary/DeviceDashboards"
import SwitchContainer from "../../organisms/templateElemets/coronavirusHungary/SwitchContainer/SwitchContainer"

function makeNumbers(array) {
  return {
    total: array.length,
    male: array.filter(({ gender }) => gender === "Férfi").length,
    female: array.filter(({ gender }) => gender === "Nő").length,
  }
}

function makeFormattedData({data, isHu}){
  if(isHu){
    return data.map(el => ({
        ...el,
        age: +el.kor,
        date: new Date(el.datum),
        number: +el.sorszam,
        gender: el.nem,
      }))
  }
  return data.map(el => ({
    ...el,
    date: new Date(el.date),
  }))
}

function CoronaVirusHungaryDashboard({ data, enData, loading }) {
  const [language, setLanguage] = useState("hu")

  const [formattedData, setFormattedData] = useState(undefined)
  const [filteredData, setFilteredData] = useState(undefined)
  const [numbers, setNumbers] = useState({ total: 0, male: 0, female: 0 })
  const [dates, setDates] = useState({
    diff: undefined,
    max: undefined,
    currDate: undefined,
  })
  const prevDates = usePrevious(dates)

  useEffect(() => {
    if (data && !formattedData) {
      const formattedData = makeFormattedData({  data, isHu: true })
      const maxDate = _.maxBy(formattedData, "date").date
      const minDate = _.minBy(formattedData, "date").date
      const dateDiff = differenceInDays(minDate, maxDate)
      setFormattedData(formattedData)
      setFilteredData(formattedData)
      setNumbers(makeNumbers(formattedData))
      setDates({
        diff: dateDiff,
        max: maxDate,
        currDate: maxDate,
      })
    }
    if (
      prevDates &&
      prevDates.currDate &&
      !_.isEqual(dates.currDate, prevDates.currDate)
    ) {
      const filteredData = formattedData.filter(
        ({ date }) => date.getTime() <= dates.currDate.getTime()
      )
      setFilteredData(filteredData)
      setNumbers(makeNumbers(filteredData))
    }
  }, [data, dates, formattedData, numbers.total, prevDates])

  return (
    <>
      <BrowserDashboard
        language={language}
        setLanguage={setLanguage}
        numbers={numbers}
        dates={dates}
        setDates={setDates}
        filteredData={filteredData}
        loading={loading}
      />
      <TabletView>
        <FlexContainer
          fullScreen
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
      <MobileOnlyView>
        <FlexContainer
          fontSize={3}
          fullScreen
          textAlign="center"
          direction="column"
        >
          <SwitchContainer
            language={language}
            setLanguage={setLanguage}
            paddingBottom={4}
          />
          {TEXT.mobileExp[language]}
          <Container paddingTop={5}>
            <GoTools size={30} />
          </Container>
        </FlexContainer>
      </MobileOnlyView>
    </>
  )
}

export default withOrientationChange(CoronaVirusHungaryDashboard)
