import React from "react"
import { withStyles } from "@material-ui/core/styles"
import Slider from "@material-ui/core/Slider"
import { format, subDays } from "date-fns"

import { FlexContainer } from "../../../../atoms"
import { TEXT } from "../../../../../constants/visualizations/coronavirusHungary"
import { colors } from "../../../../../themes/theme"

const DSlider = withStyles({
  root: {
    color: colors.grayDarker,
    fontSize: 8,
  },
  thumb: {
    "&:focus, &:hover, &$active": {
      boxShadow: "none",
      "@media (hover: none)": {
        boxShadow: "none",
      },
    },
  },
  valueLabel: {
    fontSize: 8,
  },
})(Slider)

export default function DateSlider({
  language, dates, setDates
}) {
  return (
    <FlexContainer gridArea="slider">
      <FlexContainer whiteSpace="nowrap" paddingRight={3} paddingBottom={1}>
        {TEXT.dateSlider[language]}:
      </FlexContainer>
      {dates.max && (
        <DSlider
          defaultValue={0}
          step={1}
          marks
          valueLabelDisplay="auto"
          onChange={(e, val) =>
            setDates(prev => ({
              ...prev,
              currDate: subDays(dates.max, -val),
            }))
          }
          valueLabelFormat={val =>
            format(subDays(dates.max, -val), TEXT.dateFormatShort[language])
          }
          min={dates.diff}
          max={0}
        />
      )}
    </FlexContainer>
  )
}
