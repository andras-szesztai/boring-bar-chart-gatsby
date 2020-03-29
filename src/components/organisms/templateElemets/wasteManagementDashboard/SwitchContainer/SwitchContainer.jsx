import React from "react"
import Switch from "react-switch"

import { FlexContainer, Title } from "../../../../atoms"
import { colors } from "../../../../../themes/theme"

export default function SwitchContainer({ metric, setMetric }) {
  return (
    <FlexContainer gridArea="switch">
      <Title marginBottom={1} textAlign="right" marginRight={1}>
        Per capita metric: Kg
      </Title>
      <Switch
        checked={metric === "perc"}
        onChange={() => setMetric(prev => (prev === "abs" ? "perc" : "abs"))}
        uncheckedIcon={false}
        checkedIcon={false}
        offColor={colors.grayLightest}
        onColor={colors.grayLightest}
        height={18}
        width={36}
      />
      <Title marginLeft={1}>%</Title>
    </FlexContainer>
  )
}
