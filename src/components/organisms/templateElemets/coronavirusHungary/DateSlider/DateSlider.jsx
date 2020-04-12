import React, { useRef, useState, useEffect } from "react"
import { withStyles } from "@material-ui/core/styles"
import Slider from "@material-ui/core/Slider"
import { format, subDays } from "date-fns"

import { FlexContainer, GridContainer } from "../../../../atoms"
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
      marginTop={isBelowPosition ? 2 : 0}
      paddingTop={isBelowPosition && !isBelowAndLandscape ? 2 : 0}
      gridArea={!isBelowPosition && "slider"}
      height={isBelowAndLandscape ? "50px" : "auto"}
      fixedPos={
        isBelowPosition && {
          top: 0,
          left: 0,
          width: `${windowWidth * (isLandscape ? 0.96 : 0.94)}px`,
          marginLeft: isLandscape ? "2%" : "3%",
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
