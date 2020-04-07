import React from "react"
import styled from "styled-components"

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
  return data ? (
    <TooltipContainer
      absPos
      left={data.x - (data.x <= halfWidth ? 15 : 124) + margin.left}
      isLeft={data.x <= halfWidth}
      top={data.y - 60}
      borderRadius={1}
      height="60px"
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
      <GridContainer rows="repeat(2, min-content)" columns="1fr auto">
        <FlexContainer justify="flex-start" fontWeight={3}>Életkor:</FlexContainer>
        <FlexContainer justify="flex-start">{data.age}</FlexContainer>
        <FlexContainer justify="flex-start" fontWeight={3}>Alapbetegségek:</FlexContainer>
        <FlexContainer justify="flex-start">{data.alapbetegsegek}</FlexContainer>
      </GridContainer>
    </TooltipContainer>
  ) : (
    <div />
  )
}
