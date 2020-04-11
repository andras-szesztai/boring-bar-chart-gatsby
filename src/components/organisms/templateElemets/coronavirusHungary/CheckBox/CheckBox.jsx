import React from "react"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import { withStyles } from "@material-ui/core"
import {
  colors,
  fontFamily,
  fontSize,
  fontWeight,
} from "../../../../../themes/theme"

const ChartCheckBox = withStyles({
  root: {
    marginTop: 2,
    transform: "scale(1.5)",
    "&$checked": {
      color: colors.grayDarkest,
    },
  },
  checked: {},
})(Checkbox)

const CheckBoxLabel = withStyles({
  label: {
    fontFamily,
    fontSize: fontSize[2],
    fontWeight: fontWeight.light,
  },
})(FormControlLabel)

export default function CheckBox({
  isChecked,
  setIsChecked,
  labelText,
  labelPlacement,
}) {
  return (
    <CheckBoxLabel
      control={
        <ChartCheckBox
          checked={isChecked}
          onChange={() => setIsChecked(prev => !prev)}
        />
      }
      label={labelText}
      labelPlacement={labelPlacement}
    />
  )
}
