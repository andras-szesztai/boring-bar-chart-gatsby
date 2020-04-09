import React from "react"
import Switch from "react-switch"

import { FlexContainer, Title } from "../../../../atoms"
import { colors } from "../../../../../themes/theme"

export default function SwitchContainer({
  language,
  setLanguage,
  paddingBottom,
  fontSize,
  switchWidth,
}) {
  return (
    <FlexContainer paddingBottom={paddingBottom} fontSize={fontSize}>
      <Title style={{ paddingBottom: 2 }} textAlign="right" marginRight={1}>
        Magyar
      </Title>
      <Switch
        checked={language === "en"}
        onChange={() => setLanguage(prev => (prev === "hu" ? "en" : "hu"))}
        uncheckedIcon={false}
        checkedIcon={false}
        offColor={colors.grayLightest}
        onColor={colors.grayLightest}
        height={switchWidth / 2}
        width={switchWidth}
      />
      <Title style={{ paddingBottom: 2 }}  marginLeft={1}>English</Title>
    </FlexContainer>
  )
}

SwitchContainer.defaultProps = {
  fontSize: 2,
  switchWidth: 36,
}
