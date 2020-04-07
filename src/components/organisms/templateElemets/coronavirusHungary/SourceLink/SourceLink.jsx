import React from "react"

import { FlexContainer, LinkAnchor } from "../../../../atoms"
import { TEXT } from "../../../../../constants/visualizations/coronavirusHungary"

export default function SourceLink({
  language
}) {
  return (
    <FlexContainer fontSize={2} fontWeight="thin">
      {TEXT.sourceTitle[language]}:&nbsp;
      <LinkAnchor fontsize={2} fontWeight="thin" href={TEXT.url[language]}>
        {TEXT.source[language]}
      </LinkAnchor>
    </FlexContainer>
  )
}
