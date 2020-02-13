import React from "react"
import { Title, GridContainer, FlexContainer } from "../../atoms"

export default function CreditsContainer({
  direction,
  elements = [],
  position,
  fontSize,
  absPos,
}) {
  return (
    <GridContainer
      rows={direction === "column" && `repeat(${elements.length}, 1fr)`}
      columns={direction === "row" && `repeat(${elements.length}, 1fr)`}
      absPos={absPos}
      {...position}
    >
      {elements.map(({ justify, text, link, anchorText }) => (
        <FlexContainer justify={justify} key={text}>
          <Title fontSize={fontSize} color="grayDarkest">
            {text}:{" "}
            <a href={`${link}`} target="_blank" rel="noopener noreferrer">
              {anchorText}
            </a>
          </Title>
        </FlexContainer>
      ))}
    </GridContainer>
  )
}

CreditsContainer.defaultProps = {
  fontSize: 0,
  absPos: true,
}
