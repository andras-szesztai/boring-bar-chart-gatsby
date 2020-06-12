import React from "react"
import styled from "styled-components"
import Switch from "react-switch"
import chroma from "chroma-js"

import { space } from "../../../../../themes/theme"
import { themifyFontSize } from "../../../../../themes/mixins"
import { COLORS } from "../../../../../constants/moviesDashboard"

// TODO: fix order + style selected with bolder or underline!!!
const CheckBoxContainer = styled.div`
  display: flex;
  align-items: flex-end;
  height: 35px;

  label {
    cursor: pointer;
    font-size: ${themifyFontSize(2)};
    color: ${COLORS.textColor};
    margin-left: ${space[2]}px;
  }
`

const SwitchComponent = ({ handleAction, value, onText }) => {
  return (
    <CheckBoxContainer>
      <Switch
        checked={value}
        onChange={() => handleAction(!value)}
        uncheckedIcon={false}
        checkedIcon={false}
        width={40}
        height={20}
        onColor={COLORS.textColor}
        offColor={COLORS.gridColor}
      />
      <label onClick={() => handleAction(true)} role="button">
        {onText}
      </label>
    </CheckBoxContainer>
  )
}

export default SwitchComponent