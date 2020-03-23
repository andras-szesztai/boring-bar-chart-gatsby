import React from "react"
import Switch from "react-switch"

import { GridContainer, Title, FlexContainer } from "../../../../atoms"
import { colors } from "../../../../../themes/theme"

export default function TitleContainer({ metric, setMetric }) {
  return (
    <GridContainer columnGap={2} columns="35fr 65fr" gridArea="title">
      <FlexContainer>
        <Title fontSize={3} fontWeight="medium">
          State of Waste Management in Europe
        </Title>
      </FlexContainer>
      <FlexContainer>
          <Title  textAlign="right" marginRight={1}>Per Capita Abs.</Title>
        <Switch
          checked={metric === "perc"}
          onChange={() => setMetric(prev => (prev === "abs" ? "perc" : "abs"))}
          uncheckedIcon={false}
          checkedIcon={false}
          offColor={colors.grayLightest}
          onColor={colors.grayLightest}
          height={18}
          width={40}
        />
        <Title marginLeft={1}>Per Capita %</Title>
      </FlexContainer>
    </GridContainer>
  )
}
