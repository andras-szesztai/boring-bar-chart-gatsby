import React from "react"
import chroma from "chroma-js"

import { ColoredSpan } from "../../../../atoms"

export default function LegendSpan({ color, children, textColor }) {
  return (
    <ColoredSpan
      fontWeight="medium"
      color={textColor ? textColor : chroma(color).brighten(2)}

      borderRadius={2}
      paddingLeft={1}
      paddingRight={1}
      bgColor={color}
      borderColor={chroma(color).darken(1)}
    >
     {children}
    </ColoredSpan>
  )
}
