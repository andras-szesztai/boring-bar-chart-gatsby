import React, { useRef, useState, useEffect } from "react"
import { withStyles } from "@material-ui/core/styles"
import Slider from "@material-ui/core/Slider"
import { format, subDays } from "date-fns"

import { FlexContainer, Container, GridContainer } from "../../../../atoms"
import { TEXT } from "../../../../../constants/visualizations/coronavirusHungary"
import { colors } from "../../../../../themes/theme"
import { useScrollPosition, useWindowDimensions } from "../../../../../hooks"

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
  language,
  dates,
  setDates,
  extraPadding,
  extraPaddingRight,
  extraPaddingLeft,
  fontSize,
  isSticky,
  loading,
  dateFontSize,
  fontWeight,
  currDate,
  justify,
  sliderColumns,
  sliderRows,
}) {
  const containerRef = useRef()
  const scrollPosition = useScrollPosition()
  const { windowWidth } = useWindowDimensions()
  const [containerPosition, setContainerPosition] = useState(undefined)
  useEffect(() => {
    if (!containerPosition && containerRef.current) {
      setContainerPosition(containerRef.current.getBoundingClientRect())
    }
  }, [containerPosition])
  const isBelowPosition =
    !loading &&
    isSticky &&
    containerPosition &&
    containerPosition.top < scrollPosition

  return (
    <GridContainer
      ref={containerRef}
      marginTop={isBelowPosition && 2}
      gridArea={!isBelowPosition && "slider"}
      fixedPos={
        isBelowPosition && {
          top: 0,
          left: 0,
          width: `${windowWidth * 0.94}px`,
          marginLeft: "3%",
        }
      }
      bgColor="#FFFFFF"
      withDropShadow={isBelowPosition}
      paddingRight={extraPaddingRight || extraPadding}
      paddingLeft={extraPaddingLeft || extraPadding}
      zIndex={isBelowPosition && "overlay"}
      rows="repeat(2, 1fr)"
    >
      <FlexContainer
        fontSize={dateFontSize || fontSize}
        fontWeight={fontWeight}
        justify={justify}
      >
        {currDate && format(currDate, TEXT.dateFormatLong[language])}
      </FlexContainer>
      <GridContainer
        rowGap={0}
        columnGap={2}
        columns={sliderColumns}
        rows={sliderRows}
      >
        <FlexContainer
          whiteSpace="nowrap"
          fontSize={fontSize}
          paddingBottom={2}
        >
          {TEXT.dateSlider[language]}:
        </FlexContainer>
        <FlexContainer fullSize>
          {dates.max && (
            <DSlider
              defaultValue={0}
              step={1}
              marks
              valueLabelDisplay="auto"
              onChangeCommitted={(e, val) =>
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
      </GridContainer>
    </GridContainer>
  )
}

DateSlider.defaultProps = {
  fontSize: 2,
}
