import React from "react"
import { GridContainer, FlexContainer } from "../../../../atoms"
import { space } from "../../../../../themes/theme"
import LineChart from "../LineChart/LineChart"

export default function CardGrid({ onlyChart, title, data, currDate }) {
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
        <FlexContainer withBorder>
          {currNumbers &&
            currNumbers.map(({ key, value }) => (
              <div>
                {key} {value}
              </div>
            ))}
        </FlexContainer>
      )}
    </GridContainer>
  )
}
