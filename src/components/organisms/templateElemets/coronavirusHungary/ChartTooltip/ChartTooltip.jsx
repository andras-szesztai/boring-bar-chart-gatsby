import React, { useLayoutEffect, useRef, useState } from "react"
import styled from "styled-components"
import _ from "lodash"

import { FlexContainer, GridContainer } from "../../../../atoms"
import { space, colors } from "../../../../../themes/theme"
import { TEXT } from "../../../../../constants/visualizations/coronavirusHungary"

const TooltipContainer = styled(FlexContainer)`
  max-width: 300px;
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
  const [tDims, setTooltipDims] = useState({ width: 0, height: 0 })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (tooltipRef && tooltipRef.current) {
      const boundingRect = tooltipRef.current.getBoundingClientRect()
      const newDims = { width: boundingRect.width, height: boundingRect.height }
      if (!_.isEqual(tDims, newDims)) {
        setTooltipDims(newDims)
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
        (data[xAccessor] <= halfWidth ? 15 : tDims.width - 16) +
        margin.left
      }
      isLeft={data[xAccessor] <= halfWidth}
      top={data[yAccessor] - (tDims.height +15) + margin.top}
      borderRadius={1}
      height="auto"
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
        <FlexContainer justify="flex-start" fontWeight={3} textAlign="left">
          {TEXT.tooltipGender[language]}:
        </FlexContainer>
        <FlexContainer justify="flex-start" textAlign="left">
          {data.gender}
        </FlexContainer>
        <FlexContainer justify="flex-start" fontWeight={3} textAlign="left">
          {TEXT.tooltipAge[language]}:
        </FlexContainer>
        <FlexContainer justify="flex-start" textAlign="left">
          {data.age} {TEXT.tooltipYear[language]}
        </FlexContainer>
        <FlexContainer justify="flex-start" fontWeight={3} textAlign="left">
          {TEXT.tooltipConditions[language]}:
        </FlexContainer>
        <FlexContainer justify="flex-start" textAlign="left">
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
