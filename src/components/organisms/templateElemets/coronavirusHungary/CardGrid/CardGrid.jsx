import React from "react"
import _ from "lodash"
import { GridContainer, FlexContainer } from "../../../../atoms"
import { space } from "../../../../../themes/theme"
import LineChart from "../LineChart/LineChart"
import Number from "../Number/Number"
import {
  TEXT,
  chartColors,
} from "../../../../../constants/visualizations/coronavirusHungary"

export default function CardGrid({
  onlyChart,
  title,
  data,
  currDate,
  area,
  language,
}) {
  const currNumbers =
    data &&
    currDate &&
    !onlyChart &&
    data.filter(({ date }) => currDate.toString() === date.toString())
  return (
    <GridContainer
      style={{ padding: `${space[2]}px ${space[3]}px` }}
      fullSize
      textAlign="left"
      rows={onlyChart ? "25px 1fr" : "50px 1fr 100px"}
    >
      <FlexContainer justify="flex-start" align="flex-start" fontSize={2}>
        {title}
      </FlexContainer>
      <FlexContainer withBorder>{!onlyChart && <LineChart />}</FlexContainer>
      {!onlyChart && (
        <GridContainer
          rows={
            currNumbers && (currNumbers.length > 1 ? "repeat(2, 1fr)" : "1fr")
          }
        >
          {currNumbers &&
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
                </FlexContainer>
              </GridContainer>
            ))}
        </GridContainer>
      )}
    </GridContainer>
  )
}
