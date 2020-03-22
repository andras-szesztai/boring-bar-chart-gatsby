import React, { useState, useEffect } from "react"
import { FlexContainer } from "../../../../atoms"

export default function SmallChartContainer({
  value,
  data,
  setSelected,
  selectedValue,
}) {
  const isSelected = selectedValue === value
  const [isHovered, setIsHovered] = useState(false)

  console.log(isHovered, value)

  return (
    <>
      <FlexContainer
        pos="relative"
        onClick={() => selectedValue !== value && setSelected(value)}
        cursor={!isSelected && "pointer"}
      >
        <FlexContainer
          absPos
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          bgColor={isHovered && !isSelected && "tealBlue"}
          borderRadius={1}
          fullSize
          opacity={!isSelected && .25}
          borderColor={isSelected && "tealBlue"}
          hoverable
        />
        {value}
      </FlexContainer>
    </>
  )
}
