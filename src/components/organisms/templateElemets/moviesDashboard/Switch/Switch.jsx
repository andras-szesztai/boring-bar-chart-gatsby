import React from "react"
import styled from "styled-components"
import Switch from "react-switch"

import { space } from "../../../../../themes/theme"
import { themifyFontSize } from "../../../../../themes/mixins"
import { COLORS } from "../../../../../constants/moviesDashboard"

// TODO: fix order + style selected with bolder or underline!!!
const CheckBoxContainer = styled.div`
  margin-right: ${space[4]}px;
  display: flex;
  align-items: center;
  height: 35px;

  label {
    cursor: pointer;
    font-size: ${themifyFontSize(2)};
    color: ${COLORS.textColor};
    margin-right: ${space[2]}px;
    margin-left: ${space[2]}px;
  }
`

const SwitchComponent = ({ handleAction, value, offText, onText }) => {
  return (
    <CheckBoxContainer>
      <label onClick={() => handleAction(false)} role="button">
        {offText}
      </label>
      <Switch
        checked={value}
        onChange={() => handleAction(!value)}
        uncheckedIcon={false}
        checkedIcon={false}
        width={40}
        height={20}
        onColor={COLORS.textColor}
        offColor={COLORS.textColor}
      />
      <label onClick={() => handleAction(true)} role="button">
        {onText}
      </label>
    </CheckBoxContainer>
  )
}

export default SwitchComponent