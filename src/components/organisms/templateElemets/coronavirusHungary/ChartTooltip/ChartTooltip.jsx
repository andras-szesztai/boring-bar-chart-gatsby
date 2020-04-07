import React, { useLayoutEffect, useRef, useState } from "react"
import styled from "styled-components"
import _ from "lodash"

import { FlexContainer, GridContainer } from "../../../../atoms"
import { space, colors } from "../../../../../themes/theme"

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

export default function ChartTooltip({ data, margin, width }) {
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

  return data ? (
    <TooltipContainer
      absPos
      ref={tooltipRef}
      left={data.x - (data.x <= halfWidth ? 15 : tWidth - 16) + margin.left}
      isLeft={data.x <= halfWidth}
      top={data.y - 90 + margin.top}
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
          Neme:
        </FlexContainer>
        <FlexContainer justify="flex-start">{data.gender}</FlexContainer>
        <FlexContainer justify="flex-start" fontWeight={3}>
          Életkor:
        </FlexContainer>
        <FlexContainer justify="flex-start">{data.age} év</FlexContainer>
        <FlexContainer justify="flex-start" fontWeight={3}>
          Alapbetegségek:
        </FlexContainer>
        <FlexContainer justify="flex-start">
          {_.capitalize(data.alapbetegsegek)}
        </FlexContainer>
      </GridContainer>
    </TooltipContainer>
  ) : (
    <div />
  )
}
