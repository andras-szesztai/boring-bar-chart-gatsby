import React, { useRef, useState, useEffect } from "react"
import { withStyles } from "@material-ui/core/styles"
import Slider from "@material-ui/core/Slider"
import { format, subDays } from "date-fns"

import { FlexContainer, Container } from "../../../../atoms"
import { TEXT } from "../../../../../constants/visualizations/coronavirusHungary"
import { colors } from "../../../../../themes/theme"
import { useScrollPosition } from "../../../../../hooks"

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
  textPaddingRight,
  textPaddingRightBottom,
  textPaddingRightTop,
  sliderPaddingTop,
  direction,
  fontSize,
  justify,
  isSticky,
}) {
  const containerRef = useRef()
  const scrollPosition = useScrollPosition()

  const [containerPosition, setContainerPosition] = useState(undefined)
  useEffect(() => {
    if (!containerPosition && containerRef.current) {
      setContainerPosition(containerRef.current.getBoundingClientRect().top)
    }
  }, [containerPosition])

  const isBelowPosition = isSticky && containerPosition < scrollPosition

  return (
    <FlexContainer
      ref={containerRef}
      gridArea={!isBelowPosition && "slider"}
      fixedPos={isBelowPosition && {
        top: 0,
        left: 0,
        width: "94%",
        marginLeft: "3%"
      }}
      bgColor="#FFFFFF"
      withDropShadow={isBelowPosition}
      justify={justify}
      direction={direction}
      paddingRight={extraPaddingRight || extraPadding}
      paddingLeft={extraPaddingLeft || extraPadding}
      zIndex={isBelowPosition && "overlay"}
    >
      <FlexContainer
        marginTop={isBelowPosition && 2}
        whiteSpace="nowrap"
        paddingRight={textPaddingRight}
        paddingBottom={textPaddingRightBottom}
        paddingTop={textPaddingRightTop}
        fontSize={fontSize}
      >
        {TEXT.dateSlider[language]}:
      </FlexContainer>
      <Container width="100%" paddingTop={sliderPaddingTop}>
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
      </Container>
    </FlexContainer>
  )
}

DateSlider.defaultProps = {
  fontSize: 2,
}
