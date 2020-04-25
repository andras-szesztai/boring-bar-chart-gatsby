import React from "react"

import { FlexContainer, LinkAnchor } from "../../../../atoms"
import { TEXT } from "../../../../../constants/visualizations/coronavirusHungary"

export default function SourceLink({
  language,
  fontSize,
  paddingBottom,
  justify,
  align
}) {
  return (
    <FlexContainer
      fontSize={fontSize}
      fontWeight="thin"
      paddingBottom={paddingBottom}
      justify={justify}
      align={align}
    >
      {TEXT.sourceTitle[language]}:&nbsp;
      <LinkAnchor
        fontsize={fontSize}
        fontWeight="thin"
        href={TEXT.url[language]}
      >
        {TEXT.source[language]}
      </LinkAnchor>
    </FlexContainer>
  )
}

SourceLink.defaultProps = {
  fontSize: 2,
}
