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

  .react-switch-bg {
    border: 1px solid
      ${({ isOn }) =>
        isOn
          ? chroma(COLORS.secondary).darken()
          : chroma(COLORS.backgroundGray).darken()};
  }

  label {
    cursor: pointer;
    font-size: ${themifyFontSize(2)};
    color: ${COLORS.gridColor};
    margin-left: ${space[2]}px;
  }
`

const SwitchComponent = ({ handleAction, value, onText }) => {
  return (
    <CheckBoxContainer isOn={value}>
      <Switch
        checked={value}
        onChange={() => handleAction(!value)}
        uncheckedIcon={false}
        checkedIcon={false}
        width={40}
        height={20}
        onColor={COLORS.secondary}
        offHandleColor={COLORS.gridColor}
        offColor={COLORS.backgroundGray}
      />
      <label onClick={() => handleAction(!value)} role="button" tabIndex="1">
        {onText}
      </label>
    </CheckBoxContainer>
  )
}

export default SwitchComponent
