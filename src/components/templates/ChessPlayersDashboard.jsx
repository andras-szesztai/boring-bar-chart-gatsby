import React from "react"

import {
  FlexContainer,
  GridContainer,
  CheckBox,
  SortableHandle,
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

export default function() {
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
            Controls
          </FlexContainer>
        </Container>
        <Container borderColor="gray">
          {
            // TODO: Move this part into an Organism with proper grid
          }
          <SortableComponent
            axis="x"
            lockAxis="x"
            useDragHandle
            columnGap={0.5}
            fullSize
            columns="repeat(8, 1fr)"
            items={data.map(d => (
              <FlexContainer fullSize direction="column">
                {d}
                <CheckBox value={d} initialCheck={true}/>
              </FlexContainer>
            ))}
          />
        </Container>
      </GridContainer>
    </FlexContainer>
  )
}
