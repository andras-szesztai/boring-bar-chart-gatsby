import React from "react"

import { FlexContainer, GridContainer, CheckBox, SortableHandle } from "../atoms"
import { Container } from "../atoms/containers"
import { SortableComponent } from "../molecules"

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
        <Container borderColor="gray">Controls</Container>
        <Container borderColor="gray">
        {// TODO: Move this part into an Organism with proper grid
        }
          <SortableComponent
            axis="x"
            lockAxis="x"
            useDragHandle
            columnGap={.5}
            fullSize
            columns="repeat(8, 1fr)"
            items={[
              <FlexContainer fullSize borderColor="red">
                <CheckBox
                  value="andras_szesztai"
                />
              </FlexContainer>,
              <Container fullSize borderColor="black">
                <SortableHandle
                  size="30px"
                  color="#333333"
                />
              </Container>,
              <Container fullSize borderColor="green">Green</Container>,
              <Container fullSize borderColor="red">Yellow</Container>,
              <Container fullSize borderColor="black">Black</Container>,
              <Container fullSize borderColor="green">Green</Container>,
            ]}
          />
        </Container>
      </GridContainer>
    </FlexContainer>
  )
}
