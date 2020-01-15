import React, { useState } from "react"

import {
  FlexContainer,
  GridContainer,
  CheckBox,
  SortableHandle,
  SelectAllText,
} from "../atoms"
import { Container } from "../atoms/containers"
import { SortableComponent } from "../molecules"

const data = [
  "anand",
  "botvinnik",
  "carlsen",
  "caruana",
  "fischer",
  "kasparov",
  "nakamura",
  "polgar",
]

function getInitCheckedArray() {
  let initCheckedArray = {}
  data.forEach(el => (initCheckedArray = { ...initCheckedArray, [el]: true }))
  return initCheckedArray
}

export default function() {
  const [checkedObject, setCheckedObject] = useState(getInitCheckedArray())

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
        <Container borderColor="gray">
          <FlexContainer fullSize>
            {/* TODO: finish setup */}
            <SelectAllText
              // onClick={isMissing => {  }}
              array={Object.values(checkedObject)}
            />
          </FlexContainer>
        </Container>
        <Container borderColor="gray">
          <SortableComponent
            axis="x"
            lockAxis="x"
            useDragHandle
            columnGap={0.5}
            fullSize
            columns="repeat(8, 1fr)"
            items={data.map(d => (
              <FlexContainer key={d} fullSize direction="column">
                {d}
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
        </Container>
      </GridContainer>
    </FlexContainer>
  )
}
