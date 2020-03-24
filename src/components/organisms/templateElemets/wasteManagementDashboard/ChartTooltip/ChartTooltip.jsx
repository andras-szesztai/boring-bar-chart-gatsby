import React from "react"
import styled from "styled-components"

import { space, colors } from "../../../../../themes/theme"
import { FlexContainer, Title } from "../../../../atoms"
import { COLOR_ARRAY } from "../../../../../constants/visualizing-europe/wasteManagement"

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
    border-top-color: ${colors.grayDarker};
    border-width: ${space[2]}px;
    margin-left: -${space[2]}px;
  }
`

export default function ChartTooltip({ data, storedValues, margin, metric }) {
  const isPerc = metric === "perc"
  const height = data && (isPerc ? data.data.length : data.data.length + 1) * 25
  return data ? (
    <TooltipContainer
      absPos
      left={storedValues.current.xScale(data.data[0].year) - 70 + margin.left}
      top={storedValues.current.yScale(data.maxValue) - height + 5}
      borderRadius={1}
      height={`${height}px`}
      width="140px"
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
      <>
        <FlexContainer fullSize>
          <Title fontWeight="medium">{data.data[0].yearString}</Title>
        </FlexContainer>
        {data.data.map((el, i) => {
          const metricVal =
            i === 1
              ? el.metricValue - data.data[i + 1].metricValue
              : el.metricValue
          const shouldHide = i === 0 && isPerc
          return shouldHide ? (
            <div />
          ) : (
            <FlexContainer key={el.metric} fullSize justify="space-between">
              <Title fontWeight="medium" color={COLOR_ARRAY[i]}>
                {el.metric}:
              </Title>
              <div>
                {isPerc ? `${(metricVal * 100).toFixed(0)}%` : `${metricVal}kg`}
              </div>
            </FlexContainer>
          )
        })}
      </>
    </TooltipContainer>
  ) : (
    <div />
  )
}
