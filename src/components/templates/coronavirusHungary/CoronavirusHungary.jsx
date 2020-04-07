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
import { withStyles } from "@material-ui/core/styles"
import { GoPrimitiveSquare, GoTools } from "react-icons/go"
import Switch from "react-switch"
import CountUp from "react-countup"

import {
  FlexContainer,
  GridContainer,
  LinkAnchor,
  Container,
  Title,
} from "../../atoms"
import { usePrevious } from "../../../hooks"
import { space, colors } from "../../../themes/theme"
import {
  chartColors,
  lowOpacity,
  TEXT,
} from "../../../constants/visualizations/coronavirusHungary"
import {
  HorizontalBarChart,
  StackedBarChart,
  AgeChartBrowser,
} from "../../organisms/templateElemets/coronavirusHungary"

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

const DateSlider = withStyles({
  root: {
    color: colors.grayDarker,
    fontSize: 8,
  },
  thumb: {
    "&:focus, &:hover, &$active": {
      boxShadow: "none",
      "@media (hover: none)": {
        boxShadow: "none",
      },
    },
  },
  valueLabel: {
    fontSize: 8,
  },
})(Slider)

const Number = props => (
  <CountUp
    end={props.num}
    duration={1}
    preserveValue
    formattingFn={val =>
      props.isPercentage ? numeral(val).format("0.0%") : val
    }
    decimals={props.isPercentage && 3}
  />
)

function makeNumbers(array) {
  return {
    total: array.length,
    male: array.filter(({ gender }) => gender === "Férfi").length,
    female: array.filter(({ gender }) => gender === "Nő").length,
  }
}

function CoronaVirusHungaryDashboard({ data, loading }) {
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
      const formattedData = data.map(el => ({
        ...el,
        age: +el.kor,
        rand: el.nem === "Férfi" ? _.random(10, 90) : _.random(110, 190),
        date: new Date(el.datum),
        number: +el.sorszam,
        gender: el.nem,
      }))
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
              {TEXT.mainTitle[language]}
            </FlexContainer>
            <FlexContainer
              fontSize={2}
              gridArea="source"
              justify="space-around"
              align="flex-end"
              direction="column"
            >
              <FlexContainer gridArea="switch">
                <Title marginBottom={1} textAlign="right" marginRight={1}>
                  Magyar
                </Title>
                <Switch
                  checked={language === "en"}
                  onChange={() =>
                    setLanguage(prev => (prev === "hu" ? "en" : "hu"))
                  }
                  uncheckedIcon={false}
                  checkedIcon={false}
                  offColor={colors.grayLightest}
                  onColor={colors.grayLightest}
                  height={18}
                  width={36}
                />
                <Title marginLeft={1}>English</Title>
              </FlexContainer>
              <FlexContainer fontSize={2} fontWeight="thin">
                {TEXT.sourceTitle[language]}:&nbsp;
                <LinkAnchor
                  fontsize={2}
                  fontWeight="thin"
                  href={TEXT.url[language]}
                >
                  {TEXT.source[language]}
                </LinkAnchor>
              </FlexContainer>
            </FlexContainer>
            <FlexContainer fontSize={2} justify="flex-start" gridArea="total">
              {TEXT.total[language]}:
            </FlexContainer>
            <FlexContainer fontSize={2} fontWeight={3} gridArea="tNum">
              <Number num={numbers.total} />
            </FlexContainer>
            <FlexContainer fontSize={2} gridArea="date">
              {dates.currDate &&
                format(dates.currDate, TEXT.dateFormatLong[language])}
            </FlexContainer>
            <FlexContainer gridArea="slider">
              <FlexContainer
                whiteSpace="nowrap"
                paddingRight={3}
                paddingBottom={1}
              >
                {TEXT.dateSlider[language]}:
              </FlexContainer>
              {dates.max && (
                <DateSlider
                  defaultValue={0}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                  onChange={(e, val) =>
                    setDates(prev => ({
                      ...prev,
                      currDate: subDays(dates.max, -val),
                    }))
                  }
                  valueLabelFormat={val =>
                    format(
                      subDays(dates.max, -val),
                      TEXT.dateFormatShort[language]
                    )
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
              <GoPrimitiveSquare style={{ opacity: lowOpacity }} size={20} />{" "}
              {TEXT.genderF[language]}:
            </FlexContainer>
            <FlexContainer
              fontWeight={3}
              fontSize={2}
              gridArea="noNum"
              fontColor={chartColors.female}
            >
              <Number num={numbers.female} />
            </FlexContainer>
            <FlexContainer
              justify="flex-start"
              fontSize={2}
              gridArea="ffi"
              fontColor={chartColors.male}
            >
              <GoPrimitiveSquare style={{ opacity: lowOpacity }} size={20} />{" "}
              {TEXT.genderM[language]}:
            </FlexContainer>
            <FlexContainer
              gridArea="ffiNum"
              fontWeight={3}
              fontSize={2}
              fontColor={chartColors.male}
            >
              <Number num={numbers.male} />
            </FlexContainer>
            <FlexContainer gridArea="barC">
              <HorizontalBarChart data={numbers} />
            </FlexContainer>
            <FlexContainer
              gridArea="percText"
              justify="flex-start"
              align="flex-end"
            >
              Nemek százalékos megoszlása
            </FlexContainer>
            <FlexContainer
              gridArea="percNo"
              fontWeight={3}
              fontSize={2}
              fontColor={chartColors.female}
            >
              {numbers.total && (
                <Number num={numbers.female / numbers.total} isPercentage />
              )}
            </FlexContainer>
            <FlexContainer
              gridArea="percFfi"
              fontWeight={3}
              fontSize={2}
              fontColor={chartColors.male}
            >
              {numbers.total && (
                <Number num={numbers.male / numbers.total} isPercentage />
              )}
            </FlexContainer>

            <FlexContainer gridArea="percBar">
              <StackedBarChart data={numbers} />
            </FlexContainer>

            <FlexContainer gridArea="7/-1/-1/1" pos="relative">
              <FlexContainer absPos top={space[2]} left={0} fontSize={1}>
                {TEXT.mainChartExpBrowser[language]}
              </FlexContainer>
              <AgeChartBrowser data={filteredData} />
            </FlexContainer>
          </BrowserMainGrid>
        </FlexContainer>
      </BrowserView>
      <TabletView>
        <FlexContainer
          fullScreen
          fontSize={4}
          textAlign="center"
          direction="column"
        >
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
          <FlexContainer gridArea="switch" paddingBottom={4}>
            <Title marginBottom={1} textAlign="right" marginRight={1}>
              Magyar
            </Title>
            <Switch
              checked={language === "en"}
              onChange={() =>
                setLanguage(prev => (prev === "hu" ? "en" : "hu"))
              }
              uncheckedIcon={false}
              checkedIcon={false}
              offColor={colors.grayLightest}
              onColor={colors.grayLightest}
              height={18}
              width={36}
            />
            <Title marginLeft={1}>English</Title>
          </FlexContainer>
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
