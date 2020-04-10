import React from "react"
import { format } from "date-fns"

import { FlexContainer, Container } from "../../../../atoms"
import { TEXT } from "../../../../../constants/visualizations/coronavirusHungary"

export default function CurrDateContainer({
  fontSize,
  language,
  currDate,
  titlePaddingRight,
  direction,
  dateFontSize,
}) {
  return (
    <FlexContainer
      gridArea="date"
      fontSize={fontSize}
      direction={direction}
      justify="space-evenly"
    >
      <Container fontSize={fontSize} paddingRight={titlePaddingRight}>
        {TEXT.date[language]}:
      </Container>
      <Container fontSize={dateFontSize || fontSize} fontWeight="ultraLight">
        {currDate && format(currDate, TEXT.dateFormatLong[language])}
      </Container>
    </FlexContainer>
  )
}

CurrDateContainer.defaultProps = {
  fontSize: 2,
  titlePaddingRight: 2,
}
