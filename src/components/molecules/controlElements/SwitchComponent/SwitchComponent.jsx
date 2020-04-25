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
  textMarginBottom,
  textPaddingTop,
  textSideMargin,
  switchWidth,
  isChecked,
  align
}) {
  return (
    <FlexContainer
      gridArea={gridArea}
      justify={justify}
      align={align}
      fontSize={fontSize}
      paddingBottom={containerPaddingBottom}
    >
      <Title
        marginBottom={textMarginBottom}
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
        height={switchWidth/2}
        width={switchWidth}
      />
      <Title
        marginLeft={textSideMargin}
        marginBottom={textMarginBottom}
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
