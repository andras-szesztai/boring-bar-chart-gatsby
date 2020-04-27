import React from "react"
import { withStyles } from "@material-ui/core/styles"
import Slider from "@material-ui/core/Slider"
import { format, subDays } from "date-fns"

import { FlexContainer, Container, GridContainer } from "../../../../atoms"
import { TEXT } from "../../../../../constants/visualizations/coronavirusHungary"
import { colors, space } from "../../../../../themes/theme"

export const DSlider = withStyles({
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
  markLabel: {
    top: space[3],
    transform: "translateX(5%)",
    color: colors.grayDarkest,
    fontSize: "1.5rem",
    fontWeight: 300,
    fontFamily: "inherit",
  },
  valueLabel: {
    fontSize: 8,
  },
})(Slider)

export function StyledDateSlider({
  updateCurrDate,
  dates,
  language,
  dispatch,
}) {
  const marks = [
    {
      value: dates.diff,
    },
    {
      value: dates.diff + 12,
    },
  ]
  return (
    <Container width="100%" marginTop={4}>
      <DSlider
        defaultValue={0}
        step={1}
        valueLabelDisplay="auto"
        onChangeCommitted={(e, val) =>
          updateCurrDate(dispatch, subDays(dates.max, -val))
        }
        valueLabelFormat={val =>
          format(subDays(dates.max, -val), TEXT.dateFormatShort[language])
        }
        min={dates.diff}
        max={0}
        marks={marks.map((el, i) => ({
          ...el,
          label: TEXT.sliderLabels[language][i],
        }))}
      />
    </Container>
  )
}

export function DateSlider({
  language,
  dates,
  updateCurrDate,
  dispatch,
  marginRight,
  paddingRight,
  paddingBottom,
  direction,
}) {
  const isColumn = direction === "column"
  return (
    <GridContainer
      justify="flex-start"
      whiteSpace="nowrap"
      rows={isColumn ? "min-content 1fr" : "1fr"}
      columns={!isColumn ? "min-content 1fr" : "1fr"}
      direction={direction}
    >
      <FlexContainer
        paddingRight={paddingRight}
        paddingBottom={paddingBottom}
        fontSize={2}
        whiteSpace="nowrap"
      >
        {TEXT.dateSlider[language]}:
      </FlexContainer>
      <FlexContainer fullSize pos="relative" marginRight={marginRight}>
        {dates.max && (
          <StyledDateSlider
            dates={dates}
            language={language}
            updateCurrDate={updateCurrDate}
            dispatch={dispatch}
          />
        )}
      </FlexContainer>
    </GridContainer>
  )
}
