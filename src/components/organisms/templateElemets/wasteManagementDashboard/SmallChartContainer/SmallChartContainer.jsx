import React from "react"
import { FlexContainer } from "../../../../atoms"

export default function SmallChartContainer({
  value,
  data,
  setSelected,
  selectedValue,
}) {
  const isSelected = selectedValue === value
  return (
    <FlexContainer
      withBorder
      onClick={() => selectedValue !== value && setSelected(value)}
      cursor={!isSelected && "pointer"}
    >
      {value}
    </FlexContainer>
  )
}
