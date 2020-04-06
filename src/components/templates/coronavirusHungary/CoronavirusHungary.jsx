import React, { useState, useEffect } from "react"
import styled from "styled-components"
import {
  MobileOnlyView,
  TabletView,
  BrowserView,
  withOrientationChange,
} from "react-device-detect"
import { format, differenceInDays, subDays } from "date-fns"
import numeral from "numeral"
import _ from "lodash"
import Slider from "@material-ui/core/Slider"
import { withStyles, makeStyles } from "@material-ui/core/styles"

import { FlexContainer, GridContainer, LinkAnchor } from "../../atoms"
import { usePrevious } from "../../../hooks"
import { space, colors } from "../../../themes/theme"
import { chartColors } from "../../../constants/visualizations/coronavirusHungary"
import {
  HorizontalBarChart,
  StackedBarChart,
  AgeChartBrowser,
} from "../../organisms/templateElemets/coronavirusHungary"

const DateSlider = makeStyles({
  root: {
    color: colors.grayDarker,
  },
  valueLabel: {
    fontSize: 8,
  },
})(Slider)

const BrowserMainGrid = styled(GridContainer)`
  max-width: 1400px;
  width: 95vw;

  max-height: 700px;
  min-height: 500px;
  height: 95vh;

  grid-template-columns: repeat(10, 5fr);
  grid-template-rows: min-content repeat(10, 1fr);
  grid-row-gap: ${space[1]}px;
  grid-column-gap: ${space[1]}px;
  grid-template-areas:
    "title title title title title title source source source source"
    "total tNum date date date date slider slider slider slider"
    "no noNum barC barC barC barC percText percText percText percText"
    "no noNum barC barC barC barC percNo percNo percFfi percFfi"
    "ffi ffiNum barC barC barC barC percBar percBar percBar percBar"
    "ffi ffiNum barC barC barC barC percBar percBar percBar percBar";
`

function CoronaVirusHungaryDashboard({ data, loading }) {
  const classes = makeStyles()
  const [formattedData, setFormattedData] = useState(undefined)
  const [dates, setDates] = useState({
    diff: undefined,
    max: undefined,
    currDate: undefined,
  })
  const prevDates = usePrevious(dates)
  useEffect(() => {
    if (formattedData && !dates.max) {
      const maxDate = _.maxBy(formattedData, "date").date
      const minDate = _.minBy(formattedData, "date").date
      const dateDiff = differenceInDays(minDate, maxDate)
      setDates({
        diff: dateDiff,
        max: maxDate,
        currDate: maxDate,
      })
    }
  }, [dates, formattedData])

  const [numbers, setNumbers] = useState({ total: 0, male: 0, female: 0 })
  useEffect(() => {
    if (formattedData && !numbers.total) {
      setNumbers({
        total: formattedData.length,
        male: formattedData.filter(({ gender }) => gender === "Férfi").length,
        female: formattedData.filter(({ gender }) => gender === "Nő").length,
      })
    }
  }, [data, formattedData, numbers])

  useEffect(() => {
    if (data && !formattedData) {
      setFormattedData(
        data.map(el => ({
          ...el,
          age: +el.kor,
          rand: el.nem === "Férfi" ? _.random(10, 90) : _.random(110, 190),
          date: new Date(el.datum),
          number: +el.sorszam,
          gender: el.nem,
        }))
      )
    }
    if (
      prevDates &&
      prevDates.currDate &&
      !_.isEqual(dates.currDate, prevDates.currDate)
    ) {
      console.log("run filter data")
    }
  }, [data, dates, formattedData, prevDates])

  return (
    <>
      <BrowserView>
        <FlexContainer fullScreen>
          <BrowserMainGrid>
            <FlexContainer
              gridArea="title"
              justify="flex-start"
              fontSize={4}
              fontWeight="ultraLight"
              lineHeight={1.2}
              paddingBottom={2}
            >
              Az új koronavírusban elhunytak száma, korban es nembeni eloszlása
              Magyarországon
            </FlexContainer>
            <FlexContainer fontSize={2} gridArea="source">
              Forrás:&nbsp;
              <LinkAnchor
                fontsize={2}
                fontWeight="thin"
                href="https://koronavirus.gov.hu/"
              >
                koronavirus.gov.hu
              </LinkAnchor>
            </FlexContainer>
            <FlexContainer fontSize={2} justify="flex-start" gridArea="total">
              Összesen
            </FlexContainer>
            <FlexContainer fontSize={2} fontWeight={3} gridArea="tNum">
              {numbers.total}
            </FlexContainer>
            <FlexContainer fontSize={2} gridArea="date">
              {dates.currDate && format(dates.currDate, "Y'.' MM'.' dd'.'")}
            </FlexContainer>
            <FlexContainer gridArea="slider">
              {dates.max && (
                <DateSlider
                  defaultValue={0}
                  step={1}
                  valueLabelDisplay="auto"
                  onChangeCommitted={(e, val) =>
                    setDates(prev => ({
                      ...prev,
                      currDate: subDays(dates.max, -val),
                    }))
                  }
                  valueLabelFormat={val =>
                    format(subDays(dates.max, -val), "MM'.' dd'.'")
                  }
                  min={dates.diff}
                  max={0}
                />
              )}
            </FlexContainer>
            <FlexContainer
              justify="flex-start"
              fontSize={2}
              gridArea="no"
              fontColor={chartColors.female}
            >
              Nő
            </FlexContainer>
            <FlexContainer
              fontWeight={3}
              fontSize={2}
              gridArea="noNum"
              fontColor={chartColors.female}
            >
              {numbers.female}
            </FlexContainer>
            <FlexContainer
              justify="flex-start"
              fontSize={2}
              gridArea="ffi"
              fontColor={chartColors.male}
            >
              Férfi
            </FlexContainer>
            <FlexContainer
              gridArea="ffiNum"
              fontWeight={3}
              fontSize={2}
              fontColor={chartColors.male}
            >
              {numbers.male}
            </FlexContainer>
            <FlexContainer gridArea="barC">
              <HorizontalBarChart data={numbers} />
            </FlexContainer>
            <FlexContainer gridArea="percText" align="flex-end" fontSize={2}>
              Nemek százalékos megoszlása
            </FlexContainer>
            <FlexContainer
              gridArea="percNo"
              fontWeight={3}
              fontSize={2}
              fontColor={chartColors.female}
            >
              {numeral(numbers.female / numbers.total).format("0.0%")}
            </FlexContainer>
            <FlexContainer
              gridArea="percFfi"
              fontWeight={3}
              fontSize={2}
              fontColor={chartColors.male}
            >
              {numeral(numbers.male / numbers.total).format("0.0%")}
            </FlexContainer>

            <FlexContainer gridArea="percBar">
              <StackedBarChart data={numbers} />
            </FlexContainer>

            <FlexContainer gridArea="7/-1/-1/1">
              <AgeChartBrowser data={formattedData} />
            </FlexContainer>
          </BrowserMainGrid>
        </FlexContainer>
      </BrowserView>
      <TabletView>Tablet</TabletView>
      <MobileOnlyView>Mobile</MobileOnlyView>
    </>
  )
}

export default withOrientationChange(CoronaVirusHungaryDashboard)
