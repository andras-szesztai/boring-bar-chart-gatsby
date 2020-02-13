import React from "react"
import { Title, GridContainer, FlexContainer  } from "../../atoms"

export default function({ direction, elements = [], position }) {
  return (
    <GridContainer
      rows={direction === "column" && `repeat(${elements.length}, 1fr)`}
      columns={direction === "row" && `repeat(${elements.length}, 1fr)`}
      absPos
      {...position}
    >
      {elements.map(({ justify, text, link, anchorText }) => (
        <FlexContainer justify={justify} key={text}>
          <Title fontSize={0} color="grayDarkest">
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
