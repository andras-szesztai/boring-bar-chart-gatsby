import React from "react"

import { FlexContainer } from "../../../../atoms"
import {
  TEXT,
  chartColors,
} from "../../../../../constants/visualizations/coronavirusHungary"
import Number from "../Number/Number"
import { StackedBarChart } from ".."

export default function PercChartContainer({ language, numbers }) {
  return (
    <>
      <FlexContainer gridArea="percText" justify="flex-start" align="flex-end">
        {TEXT.genderPerc[language]}
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
    </>
  )
}
