import React, { useState } from "react"

import { FlexContainer, GridContainer, CheckBox, SelectAllText } from "../atoms"
import { Container } from "../atoms/containers"
import { SortableComponent } from "../molecules"

const dataKeys = [
  "anand",
  "botvinnik",
  "carlsen",
  "caruana",
  "fischer",
  "kasparov",
  "nakamura",
  "polgar",
]

function checkUncheckAll(bool) {
  let checkArray = {}
  dataKeys.forEach(key => (checkArray = { ...checkArray, [key]: bool }))
  return checkArray
}

export default function() {
  const [checkedObject, setCheckedObject] = useState(checkUncheckAll(true))

  return (
    <FlexContainer fullScreen>
      <GridContainer
        width="95%"
        maxWidth="1440"
        minWidth="1100"
        height="95%"
        maxHeight="720"
        minHeight="600"
        columns="200px 1fr"
      >
        <GridContainer rows="150px 1fr">
          <FlexContainer borderColor="gray">Title</FlexContainer>
          <GridContainer rows="1fr 50px">
            <GridContainer rows="1fr 100px">
              <FlexContainer borderColor="gray">Chart Control</FlexContainer>
              <FlexContainer borderColor="gray" direction="column" justify="space-evenly">
                <FlexContainer borderColor="gray">
                  LDW Select
                </FlexContainer>
                <SelectAllText
                  handleClick={isMissing => {
                    setCheckedObject(
                      isMissing ? checkUncheckAll(true) : checkUncheckAll(false)
                    )
                  }}
                  array={Object.values(checkedObject)}
                />
              </FlexContainer>
            </GridContainer>
            <FlexContainer borderColor="gray">Brush Control</FlexContainer>
          </GridContainer>
        </GridContainer>
        <GridContainer rows="1fr 50px">
          <SortableComponent
            axis="x"
            lockAxis="x"
            // useDragHandle
            columnGap={0.5}
            fullSize
            columns="repeat(8, 1fr)"
            items={dataKeys.map(d => (
              <FlexContainer key={d} fullSize direction="column">
                <CheckBox
                  parentChecked
                  checked={checkedObject[d]}
                  test={checkedObject}
                  value={d}
                  onClick={() =>
                    setCheckedObject(prev => ({ ...prev, [d]: !prev[d] }))
                  }
                />
              </FlexContainer>
            ))}
          />
          <FlexContainer borderColor="gray">Filters</FlexContainer>
        </GridContainer>
      </GridContainer>
    </FlexContainer>
  )
}
