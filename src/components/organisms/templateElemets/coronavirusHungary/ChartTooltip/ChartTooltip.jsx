import React, { useLayoutEffect, useRef, useState } from "react"
import styled from "styled-components"
import _ from "lodash"

import { FlexContainer, GridContainer } from "../../../../atoms"
import { space, colors } from "../../../../../themes/theme"
import { TEXT } from "../../../../../constants/visualizations/coronavirusHungary"

const TooltipContainer = styled(FlexContainer)`
  :after {
    top: 100%;
    left: ${props => props.isLeft && 14}px;
    right: ${props => !props.isLeft && 7}px;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(136, 183, 213, 0);
    border-top-color: ${colors.grayDarker};
    border-width: ${space[2]}px;
    margin-left: -${space[2]}px;
  }
`

export default function ChartTooltip({
  data,
  margin,
  width,
  language,
  isCombined,
}) {
  const halfWidth = width / 2
  const tooltipRef = useRef()
  const [tWidth, setTWidth] = useState(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (tooltipRef && tooltipRef.current) {
      const newWidth = tooltipRef.current.getBoundingClientRect().width
      if (newWidth !== tWidth) {
        setTWidth(newWidth)
      }
    }
  })

  const xAccessor = isCombined ? "combinedX" : "genderX"
  const yAccessor = isCombined ? "combinedY" : "genderY"

  return data ? (
    <TooltipContainer
      absPos
      ref={tooltipRef}
      left={
        data[xAccessor] -
        (data[xAccessor] <= halfWidth ? 15 : tWidth - 16) +
        margin.left
      }
      isLeft={data[xAccessor] <= halfWidth}
      top={data[yAccessor] - 90 + margin.top}
      borderRadius={1}
      height="75px"
      width="auto"
      borderColor="grayDarker"
      zIndex="overlay"
      bgColor="#ffffff"
      noPointerEvents
      direction="column"
      align="flex-start"
      paddingLeft={2}
      paddingRight={2}
      paddingTop={1}
      paddingBottom={1}
    >
      <GridContainer
        rows="repeat(3, min-content)"
        columns="1fr auto"
        rowGap={0.5}
        columnGap={1.2}
      >
        <FlexContainer justify="flex-start" fontWeight={3}>
          {TEXT.tooltipGender[language]}:
        </FlexContainer>
        <FlexContainer justify="flex-start">{data.gender}</FlexContainer>
        <FlexContainer justify="flex-start" fontWeight={3}>
          {TEXT.tooltipAge[language]}:
        </FlexContainer>
        <FlexContainer justify="flex-start">
          {data.age} {TEXT.tooltipYear[language]}
        </FlexContainer>
        <FlexContainer justify="flex-start" fontWeight={3}>
          {TEXT.tooltipConditions[language]}:
        </FlexContainer>
        <FlexContainer justify="flex-start">
          {_.capitalize(
            language === "hu"
              ? data.alapbetegsegek
              : data["underlying conditions"]
          )}
        </FlexContainer>
      </GridContainer>
    </TooltipContainer>
  ) : (
    <div />
  )
}
