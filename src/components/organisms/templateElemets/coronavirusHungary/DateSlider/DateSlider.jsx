import React, { useRef, useState, useEffect } from "react"
import { withStyles } from "@material-ui/core/styles"
import Slider from "@material-ui/core/Slider"
import { format, subDays } from "date-fns"

import { FlexContainer, GridContainer, Container } from "../../../../atoms"
import { TEXT } from "../../../../../constants/visualizations/coronavirusHungary"
import { colors } from "../../../../../themes/theme"
import { useScrollPosition, useWindowDimensions } from "../../../../../hooks"
import CurrDateContainer from "../CurrDateContainer/CurrDateContainer"

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
  return (
    <DSlider
      defaultValue={0}
      step={1}
      marks
      valueLabelDisplay="auto"
      onChangeCommitted={(e, val) =>
        updateCurrDate(dispatch, subDays(dates.max, -val))
      }
      valueLabelFormat={val =>
        format(subDays(dates.max, -val), TEXT.dateFormatShort[language])
      }
      min={dates.diff}
      max={0}
    />
  )
}

export function DateSlider({
  language,
  dates,
  updateCurrDate,
  dispatch,
  marginRight,
}) {
  return (
    <FlexContainer
      justify="flex-start"
      whiteSpace="nowrap"
      paddingTop={1}
      marginRight={marginRight}
    >
      <Container
        paddingRight={3}
        paddingBottom={1}
        fontSize={2}
        whiteSpace="nowrap"
      >
        {TEXT.dateSlider[language]}:
      </Container>
      {dates.max && (
        <StyledDateSlider
          dates={dates}
          language={language}
          updateCurrDate={updateCurrDate}
          dispatch={dispatch}
        />
      )}
    </FlexContainer>
  )
}

export function DateSliderMobile({
  language,
  dates,
  setDates,
  extraPadding,
  extraPaddingRight,
  fontSize,
  isSticky,
  loading,
  dateFontSize,
  fontWeight,
  currDate,
  isLandscape,
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
  const isBelowAndLandscape = isLandscape && isBelowPosition

  return (
    <GridContainer
      ref={containerRef}
      marginTop={2}
      paddingTop={isBelowPosition && !isBelowAndLandscape ? 2 : 0}
      gridArea={!isBelowPosition && "slider"}
      borderRadius={1}
      height={isBelowAndLandscape ? "55px" : "auto"}
      fixedPos={
        isBelowPosition && {
          top: 0,
          left: 0,
          width: `${windowWidth * (isLandscape ? 0.97 : 0.92)}px`,
          marginLeft: isLandscape ? `${containerPosition.x / 2}px` : "4%",
        }
      }
      bgColor="#FFFFFF"
      withDropShadow={isBelowPosition}
      paddingRight={isBelowAndLandscape ? 3 : extraPaddingRight || extraPadding}
      paddingLeft={isBelowPosition ? 3 : extraPadding}
      zIndex={isBelowPosition && "overlay"}
      alignContent="center"
      rows={isBelowAndLandscape ? "1fr" : "repeat(2, 1fr)"}
      columns={isBelowAndLandscape ? "min-content 1fr" : "1fr"}
    >
      <FlexContainer
        fontSize={dateFontSize || fontSize}
        fontWeight={fontWeight}
        justify={isLandscape ? "flex-start" : "center"}
        whiteSpace="nowrap"
      >
        {currDate && format(currDate, TEXT.dateFormatLong[language])}
      </FlexContainer>
      <GridContainer
        rowGap={0}
        columnGap={2}
        columns={isBelowAndLandscape ? "min-content 1fr" : "1fr"}
        rows="repeat(2, min-content)"
        paddingLeft={isBelowAndLandscape ? 3 : 0}
        paddingRight={isBelowAndLandscape ? 2 : 0}
        paddingTop={isBelowAndLandscape ? 2 : 0}
      >
        <FlexContainer
          justify={isLandscape ? "flex-start" : "center"}
          whiteSpace="nowrap"
          fontSize={fontSize}
        >
          {TEXT.dateSlider[language]}:
        </FlexContainer>
        <FlexContainer
          fullSize
          paddingTop={isBelowAndLandscape || isLandscape ? 1 : 0}
        >
          {dates.max && (
            <StyledDateSlider
              dates={dates}
              language={language}
              setDates={setDates}
            />
          )}
        </FlexContainer>
      </GridContainer>
    </GridContainer>
  )
}
