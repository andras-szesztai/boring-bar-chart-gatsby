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
  fontWeight,
  paddingBottom
}) {
  return (
    <FlexContainer
      gridArea="date"
      fontSize={fontSize}
      direction={direction}
      justify="space-evenly"
      paddingBottom={paddingBottom}
    >
      <Container fontSize={fontSize} paddingRight={titlePaddingRight}>
        {TEXT.date[language]}:
      </Container>
      <Container fontSize={dateFontSize || fontSize} fontWeight={fontWeight}>
        {currDate && format(currDate, TEXT.dateFormatLong[language])}
      </Container>
    </FlexContainer>
  )
}

CurrDateContainer.defaultProps = {
  fontSize: 2
}
