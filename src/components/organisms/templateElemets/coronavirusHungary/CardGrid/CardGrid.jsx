import React from "react"
import { GridContainer, FlexContainer } from "../../../../atoms"
import { space } from "../../../../../themes/theme"
import LineChart from "../LineChart/LineChart"
import Number from "../Number/Number"
import {
  TEXT,
  chartColors,
} from "../../../../../constants/visualizations/coronavirusHungary"
import AgeChartBrowser from "../AgeChartBrowser/AgeChartBrowser"

export default function CardGrid({
  onlyChart,
  title,
  data,
  currDate,
  area,
  language,
  type,
  device,
}) {
  const currNumbers =
    data &&
    currDate &&
    !onlyChart &&
    data.filter(({ date }) => currDate.toString() === date.toString())

  const isRunningLessThanMinDate =
    area === "daily" &&
    currDate <
      new Date(
        "Thu Mar 26 2020 00:00:00 GMT+0100 (Central European Standard Time)"
      )
  const isRatioFront = area === "ratio" && type === "front"
  return (
    <GridContainer
      style={{ padding: `${space[2]}px ${space[3]}px` }}
      fullSize
      textAlign="left"
      rows={onlyChart ? "25px 1fr 25px" : "50px 1fr 100px 25px"}
    >
      <FlexContainer justify="flex-start" align="flex-start" fontSize={2}>
        {title}
      </FlexContainer>
      <FlexContainer>
        {!isRatioFront ? (
          !onlyChart ? (
            <LineChart
              key={type + area}
              data={data}
              currDate={currDate}
              isPercentage={area === "ratio"}
            />
          ) : (
            <AgeChartBrowser
              key={type + area}
              data={data}
              language={language}
              isCombined={type === "front"}
            />
          )
        ) : (
          <FlexContainer fontSize={2}>
            {TEXT.ratioFront[device][language]}
          </FlexContainer>
        )}
      </FlexContainer>
      {!onlyChart && (
        <GridContainer
          rows={
            currNumbers && (currNumbers.length > 1 ? "repeat(2, 1fr)" : "1fr")
          }
        >
          {currNumbers &&
            (!isRunningLessThanMinDate ? (
              currNumbers.map(({ key, value }) => (
                <GridContainer columns="repeat(2, 1fr)" key={key + area}>
                  <FlexContainer fontSize={2} fontColor={chartColors[key]}>
                    {TEXT[key][language]}:
                  </FlexContainer>
                  <FlexContainer
                    fontSize={2}
                    fontWeight="medium"
                    fontColor={chartColors[key]}
                  >
                    <Number
                      num={value}
                      isPercentage={area === "ratio"}
                      oneDecimal={area === "age"}
                    />
                    {area === "age"
                      ? `‎‎‏‏‎ ‎${TEXT.tooltipYear[language]}`
                      : ""}
                  </FlexContainer>
                </GridContainer>
              ))
            ) : (
              <FlexContainer fontSize={2}>
                {TEXT.dailyBefore[language]}
              </FlexContainer>
            ))}
        </GridContainer>
      )}
      <FlexContainer>
        {!isRatioFront && TEXT.cardExplanation[device][type][language]}
      </FlexContainer>
    </GridContainer>
  )
}
