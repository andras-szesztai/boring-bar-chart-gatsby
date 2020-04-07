import React from "react"
import Switch from "react-switch"

import { FlexContainer, Title } from "../../../../atoms"
import { colors } from "../../../../../themes/theme"

export default function SwitchContainer({ language, setLanguage, paddingBottom }) {
  return (
    <FlexContainer paddingBottom={paddingBottom}>
      <Title marginBottom={1} textAlign="right" marginRight={1}>
        Magyar
      </Title>
      <Switch
        checked={language === "en"}
        onChange={() => setLanguage(prev => (prev === "hu" ? "en" : "hu"))}
        uncheckedIcon={false}
        checkedIcon={false}
        offColor={colors.grayLightest}
        onColor={colors.grayLightest}
        height={18}
        width={36}
      />
      <Title marginLeft={1}>English</Title>
    </FlexContainer>
  )
}
