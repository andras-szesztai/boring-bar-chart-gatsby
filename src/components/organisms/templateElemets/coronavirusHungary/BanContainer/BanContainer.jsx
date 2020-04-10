import React from "react"
import { GoPrimitiveSquare } from "react-icons/go"

import { FlexContainer, Container, GridContainer } from "../../../../atoms"
import { lowOpacity } from "../../../../../constants/visualizations/coronavirusHungary"
import Number from "../Number/Number"

export default function BanContainer({
  justify,
  numJustify,
  gridArea,
  align,
  text,
  withIcon,
  number,
  numMarginTop,
  numMarginBottom,
  color,
  rows,
  columns,
}) {
  return (
    <GridContainer
      gridArea={gridArea}
      rows={rows}
      columns={columns}
    >
      <FlexContainer
        fontColor={color}
        fontSize={2}
        justify={justify}
        align={align}
      >
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
      <FlexContainer
        fontWeight={3}
        fontSize={3}
        marginTop={numMarginTop}
        marginBottom={numMarginBottom}
        fontColor={color}
        justify={numJustify || justify}
        align={align}
      >
        <Number num={number} />
      </FlexContainer>
    </GridContainer>
  )
}
