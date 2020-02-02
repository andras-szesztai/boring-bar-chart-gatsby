import React from "react"
import { CheckBox, GridContainer, FlexContainer, Title } from "../../atoms"

export default function({
  values,
  colorRange,
  checkedObject,
  handleClick,
  title,
}) {
  return (
    <FlexContainer direction="column">
      <Title fontWeight={3} marginBottom={2}>
        {title}
      </Title>
      <GridContainer columns={`repeat(${values.length}, 1fr)`}>
        {values.map((val, i) => (
          <FlexContainer key={val} direction="column">
            <CheckBox
              parentChecked
              checked={checkedObject[val]}
              color={colorRange[i]}
              value={val}
              onClick={() => handleClick(val)}
            />
            {val}
          </FlexContainer>
        ))}
      </GridContainer>
    </FlexContainer>
  )
}
