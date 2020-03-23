import React from "react"
import styled from "styled-components"

import { space, colors } from "../../../../../themes/theme"
import { FlexContainer, Title } from "../../../../atoms"

const TooltipContainer = styled(FlexContainer)`
  :after {
    top: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(136, 183, 213, 0);
    border-top-color: ${colors.grayDarkest};
    border-width: ${space[2]}px;
    margin-left: -${space[2]}px;
  }
`

export default function ChartTooltip({ data, storedValues, margin }) {
  const colorArray = ["#de88a5", "#7a9eaf", "#655989"]
  return data ? (
    <TooltipContainer
      absPos
      left={storedValues.current.xScale(data.data[0].year) - 65 + margin.left}
      top={
        storedValues.current.yScale(data.maxValue) - data.data.length * 20 - 5
      }
      borderRadius={1}
      height={`${data.data.length * 20}px`}
      width="130px"
      borderColor="grayDarkest"
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
      {data.data.map((el, i) => (
        <FlexContainer key={el} fullSize justify="space-between">
          <Title fontWeight="medium" color={colorArray[i]}>
            {el.metric}:
          </Title>
          <div>1</div>
        </FlexContainer>
      ))}
    </TooltipContainer>
  ) : (
    <div />
  )
}
