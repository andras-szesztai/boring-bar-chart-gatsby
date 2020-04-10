import React from "react"

import { FlexContainer, LinkAnchor } from "../../../../atoms"
import { TEXT } from "../../../../../constants/visualizations/coronavirusHungary"

export default function SourceLink({ language, fontSize, paddingBottom }) {
  return (
    <FlexContainer fontSize={fontSize} fontWeight="thin" paddingBottom={paddingBottom}>
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
