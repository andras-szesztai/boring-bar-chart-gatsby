import React from "react"
import { format } from "date-fns"

import { FlexContainer, Container } from "../../../../atoms"
import { TEXT } from "../../../../../constants/visualizations/coronavirusHungary"

export default function CurrDateContainer({ language, currDate }) {
  return (
    <FlexContainer justify="flex-start">
      <Container fontSize={3} fontWeight="ultraLight">
        {currDate && format(currDate, TEXT.dateFormatLong[language])}
      </Container>
    </FlexContainer>
  )
}

CurrDateContainer.defaultProps = {
  fontSize: 2,
}
