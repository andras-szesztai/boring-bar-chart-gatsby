import React from "react"
import Switch from "react-switch"

import { FlexContainer, Title } from "../../../atoms"
import { colors } from "../../../../themes/theme"

export default function SwitchComponent({
  gridArea,
  onChange,
  justify,
  text,
  fontSize,
  containerPaddingBottom,
  textPaddingBottom,
  textPaddingTop,
  textSideMargin,
  switchWidth,
  isChecked
}) {
  return (
    <FlexContainer
      gridArea={gridArea}
      justify={justify}
      fontSize={fontSize}
      paddingBottom={containerPaddingBottom}
    >
      <Title
        paddingBottom={textPaddingBottom}
        paddingTop={textPaddingTop}
        textAlign="right"
        marginRight={textSideMargin}
      >
        {text[0]}
      </Title>
      <Switch
        checked={isChecked}
        onChange={onChange}
        uncheckedIcon={false}
        checkedIcon={false}
        offColor={colors.grayLightest}
        onColor={colors.grayLightest}
        height={switchWidth}
        width={switchWidth}
      />
      <Title
        marginLeft={textSideMargin}
        paddingBottom={textPaddingBottom}
        paddingTop={textPaddingTop}
      >
        {text[1]}
      </Title>
    </FlexContainer>
  )
}

SwitchComponent.defaultProps = {
  fontSize: 2,
  switchWidth: 36,
}
