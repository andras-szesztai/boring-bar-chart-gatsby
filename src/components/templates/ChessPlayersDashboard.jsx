import React from "react"
import { FlexContainer, GridContainer } from "../atoms"
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
          <SortableComponent
            axis="x"
            columns="repeat(8, 1fr)"
            items={[
              <Container borderColor="red">Yellow</Container>,
              <Container borderColor="black">Black</Container>,
              <Container borderColor="green">Green</Container>,
              <Container borderColor="red">Yellow</Container>,
              <Container borderColor="black">Black</Container>,
              <Container borderColor="green">Green</Container>,
            ]}
          />
        </Container>
      </GridContainer>
    </FlexContainer>
  )
}
