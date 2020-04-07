import React from "react"
import { GoPrimitiveSquare } from "react-icons/go"

import { FlexContainer } from "../../../../atoms"
import { chartColors, lowOpacity, TEXT } from "../../../../../constants/visualizations/coronavirusHungary"
import Number from "../Number/Number"

export default function BarLabels({
  language, numbers
}) {
  return (
    <>
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
    </>
  )
}
