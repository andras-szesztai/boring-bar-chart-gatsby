import React from "react"
import { Title, GridContainer, FlexContainer, LinkAnchor } from "../../../atoms"

export default function CreditsContainer({
  direction,
  linkColor,
  elements = [],
  position,
  fontSize,
  fontWeight,
  absPos,
  color
}) {
  return (
    <GridContainer
      rows={direction === "column" ? `repeat(${elements.length}, 1fr)` : ""}
      columns={direction === "row" ? `repeat(${elements.length}, 1fr)` : ""}
      absPos={absPos}
      {...position}
    >
      {elements.map(({ justify, text, link, anchorText }) => (
        <FlexContainer justify={justify} align="flex-start" key={text}>
          <Title fontSize={fontSize} color={color}>
            {text && `${text}: `}
            <LinkAnchor
              href={link}
              fontSize={fontSize}
              fontWeight={fontWeight}
              target="_blank"
              rel="noopener noreferrer"
              color={linkColor}
            >
              {anchorText}
            </LinkAnchor>
          </Title>
        </FlexContainer>
      ))}
    </GridContainer>
  )
}

CreditsContainer.defaultProps = {
  direction: "row",
  color: "gray",
  fontSize: 1,
  absPos: true,
  fontWeight: 3,
}
