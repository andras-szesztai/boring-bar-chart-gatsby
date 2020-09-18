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
    top: space[4],
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
  sliderMarginTop,
}) {
  const marks = [
    {
      value: dates.diff,
    },
    {
      value: dates.diff + 12,
    },
    {
      value: dates.diff + 42,
    },
    {
      value: dates.diff + 73,
    },
    {
      value: dates.diff + 103,
    },
    {
      value: dates.diff + 134,
    },
    {
      value: dates.diff + 165,
    },
  ]
  return (
    <Container width="100%" marginTop={sliderMarginTop}>
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
  sliderMarginRight,
  labelPaddingRight,
  direction,
  sliderMarginTop,
}) {
  const isColumn = direction === "column"
  return (
    <GridContainer
      justify="flex-start"
      noWrap
      rows={isColumn ? "min-content 1fr" : "1fr"}
      columns={!isColumn ? "min-content minmax(150px,600px)" : "1fr"}
      direction={direction}
    >
      <FlexContainer paddingRight={labelPaddingRight} fontSize={2} noWrap>
        {TEXT.dateSlider[language]}:
      </FlexContainer>
      <FlexContainer
        fullSize
        pos="relative"
        marginRight={sliderMarginRight}
        marginTop={sliderMarginTop}
      >
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
