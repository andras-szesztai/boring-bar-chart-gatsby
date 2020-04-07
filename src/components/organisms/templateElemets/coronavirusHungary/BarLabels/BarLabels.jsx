import React from "react"
import { GoPrimitiveSquare } from "react-icons/go"

import { FlexContainer, Container } from "../../../../atoms"
import {
  chartColors,
  lowOpacity,
  TEXT,
} from "../../../../../constants/visualizations/coronavirusHungary"
import Number from "../Number/Number"

export default function BarLabels({ language, numbers }) {
  return (
    <>
      <FlexContainer
        justify="flex-start"
        fontSize={2}
        gridArea="no"
        fontColor={chartColors.female}
      >
        <Container paddingTop={1}>
          <GoPrimitiveSquare
            color={chartColors.female}
            style={{ opacity: lowOpacity }}
            size={20}
          />{" "}
        </Container>
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
        <Container paddingTop={1}>
          <GoPrimitiveSquare
            color={chartColors.male}
            style={{ opacity: lowOpacity }}
            size={20}
          />{" "}
        </Container>
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
    </>
  )
}
