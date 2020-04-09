import React, { useState, useEffect } from "react"
import { TabletView } from "react-device-detect"
import Helmet from "react-helmet"
import { differenceInDays } from "date-fns"
import _ from "lodash"
import { GoTools } from "react-icons/go"

import { FlexContainer, Container } from "../../atoms"
import { usePrevious, useDeviceType } from "../../../hooks"
import { TEXT } from "../../../constants/visualizations/coronavirusHungary"
import {
  BrowserDashboard,
  MobileDashboard,
} from "../../organisms/templateElemets/coronavirusHungary/DeviceDashboards"
import SwitchContainer from "../../organisms/templateElemets/coronavirusHungary/SwitchContainer/SwitchContainer"

function makeNumbers(array, lan) {
  return {
    total: array.length,
    male: array.filter(({ gender }) => gender === TEXT.genderM[lan]).length,
    female: array.filter(({ gender }) => gender === TEXT.accessorF[lan]).length,
  }
}

function makeFormattedData({ data, isHu }) {
  if (isHu) {
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
    age: +el.age,
    number: +el.number,
  }))
}

function CoronaVirusHungaryDashboard({ data, enData, loading }) {
  const [language, setLanguage] = useState("hu")
  const prevLanguage = usePrevious(language)

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
      const formattedData = makeFormattedData({ data, isHu: true })
      const maxDate = _.maxBy(formattedData, "date").date
      const minDate = _.minBy(formattedData, "date").date
      const dateDiff = differenceInDays(minDate, maxDate)
      setFormattedData(formattedData)
      setFilteredData(formattedData)
      setNumbers(makeNumbers(formattedData, language))
      setDates({
        diff: dateDiff,
        max: maxDate,
        currDate: maxDate,
      })
    }
    if (prevLanguage && language !== prevLanguage) {
      const isHu = language === "hu"
      const dataSet = isHu ? data : enData
      const formattedData = makeFormattedData({ data: dataSet, isHu })
      setFormattedData(formattedData)
      setFilteredData(
        formattedData.filter(
          ({ date }) => date.getTime() <= dates.currDate.getTime()
        )
      )
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
      setNumbers(makeNumbers(filteredData, language))
    }
  }, [
    data,
    dates,
    enData,
    formattedData,
    language,
    numbers,
    prevDates,
    prevLanguage,
  ])

  const device = useDeviceType()

  return (
    <>
      <Helmet title={TEXT.helmet[language]} />
      {device === "desktop" && (
        <BrowserDashboard
          language={language}
          setLanguage={setLanguage}
          numbers={numbers}
          dates={dates}
          setDates={setDates}
          filteredData={filteredData}
          loading={loading}
        />
      )}
      {device === "tablet" && (
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
      )}
      {device === "mobile" && <MobileDashboard />}
    </>
  )
}

export default CoronaVirusHungaryDashboard
