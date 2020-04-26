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
import AreaChart from "../AreaChart/AreaChart"

export default function CardGrid({
  onlyChart,
  title,
  data,
  currDate,
  area,
  language,
  type,
  device,
  fullListDomain,
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

  const isFront = type === "front"
  const deviceAccessor = device === "desktop" ? device : "mobile"
  const isRatioFront = area === "ratio" && isFront
  return (
    <GridContainer
      style={{ padding: `${space[2]}px ${space[3]}px` }}
      fullSize
      textAlign="left"
      rows={onlyChart ? "35px 1fr 25px" : "50px 1fr 100px 25px"}
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
          ) : device === "desktop" ? (
            <AgeChartBrowser
              key={type + area}
              data={data}
              language={language}
              isCombined={type === "front"}
            />
          ) : (
            <GridContainer fullSize rows={isFront ? "1fr" : "repeat(2, 1fr)"}>
              {isFront ? (
                <FlexContainer fullSize withBorder></FlexContainer>
              ) : (
                <>
                  <FlexContainer>
                    <AreaChart
                      key="femaleArea"
                      data={
                        data &&
                        data.filter(
                          ({ gender }) => gender === TEXT.accessorF[language]
                        )
                      }
                      accessor="female"
                      fullListDomain={fullListDomain}
                      language={language}
                    />
                  </FlexContainer>
                  <FlexContainer>
                    <AreaChart
                      key="femaleArea"
                      data={
                        data &&
                        data.filter(
                          ({ gender }) => gender === TEXT.accessorM[language]
                        )
                      }
                      accessor="male"
                      fullListDomain={fullListDomain}
                      language={language}
                    />
                  </FlexContainer>
                </>
              )}
            </GridContainer>
          )
        ) : (
          <FlexContainer fontSize={2}>
            {TEXT.ratioFront[deviceAccessor][language]}
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
        {!isRatioFront && TEXT.cardExplanation[deviceAccessor][type][language]}
      </FlexContainer>
    </GridContainer>
  )
}
