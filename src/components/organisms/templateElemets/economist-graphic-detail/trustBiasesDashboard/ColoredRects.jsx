import React from "react"
import chroma from "chroma-js"

import { GridContainer, FlexContainer, ColoredSpan } from "../../../atoms"
import { COLOR_RANGE } from "../../../../constants/trustBiases"

export default function ColoredRects({
  currHovered,
  accC,
  accT,
  origin,
  dest,
  isTrust,
  sameData,
}) {
  const trustColor = COLOR_RANGE[3]
  const distrustColor = COLOR_RANGE[0]

  const getFontColor = color =>
    color &&
    (chroma(color).luminance() > 0.5
      ? chroma(color)
          .darken(3)
          .hex()
      : chroma(color)
          .brighten(3)
          .hex())

  return (
    currHovered[accT] !== 100 && (
      <GridContainer columns="40px auto">
        <FlexContainer
          bgColor={currHovered[accC]}
          fontWeight="semiBold"
          fontColor={getFontColor(currHovered[accC])}
          justify="flex-end"  
          paddingRight={1}
        >
          {(currHovered[accT] * 100).toFixed(0)}
        </FlexContainer>
        <FlexContainer justify="flex-start">
          <div>
            <ColoredSpan fontWeight="semiBold">{origin} </ColoredSpan> tends to{" "}
            <ColoredSpan
              color={isTrust ? trustColor : distrustColor}
              fontWeight="semiBold"
            >
              {isTrust ? "trust" : "distrust"}
            </ColoredSpan>{" "}
            {dest === origin
              ? currHovered[accT] > sameData
                ? "itself above average"
                : "itself below average"
              : dest}
          </div>
        </FlexContainer>
      </GridContainer>
    )
  )
}
