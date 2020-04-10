import React from "react"
import { GoPrimitiveSquare } from "react-icons/go"

import { FlexContainer, Container } from "../../../../atoms"
import { lowOpacity } from "../../../../../constants/visualizations/coronavirusHungary"
import Number from "../Number/Number"

export default function BanContainer({
  justify,
  direction,
  gridArea,
  align,
  text,
  withIcon,
  number,
  numMarginTop,
  numMarginBottom,
  color,
}) {
  return (
    <FlexContainer
      gridArea={gridArea}
      direction={direction}
      justify={justify}
      align={align}
    >
      <FlexContainer fontColor={color} fontSize={2}>
        {withIcon && (
          <Container paddingTop={1}>
            <GoPrimitiveSquare
              color={color}
              style={{ opacity: lowOpacity }}
              size={withIcon.iconSize || 20}
            />
          </Container>
        )}
        {text}:
      </FlexContainer>
      <Container
        fontWeight={3}
        fontSize={3}
        marginTop={numMarginTop}
        marginBottom={numMarginBottom}
        fontColor={color}
      >
        <Number num={number} />
      </Container>
    </FlexContainer>
  )
}
