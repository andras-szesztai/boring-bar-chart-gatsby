import React from "react"
import { CheckBox, GridContainer, FlexContainer } from "../../atoms"

export default function({ values, colorRange, checkedObject, handleClick }) {
  return (
    <GridContainer 
      columns={`repeat(${values.length}, 1fr)`}
    >
      {values.map((val, i) => (
        <FlexContainer direction="column"  >
          {val}
          <CheckBox
            parentChecked
            checked={checkedObject[val]}
            color={colorRange[i]}
            value={val}
            onClick={() =>
              handleClick(val)
            }
          />
        </FlexContainer>
      ))}
    </GridContainer>
  )
}
