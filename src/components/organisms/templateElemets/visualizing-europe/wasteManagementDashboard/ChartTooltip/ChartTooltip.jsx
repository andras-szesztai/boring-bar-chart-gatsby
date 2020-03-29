import React from "react"
import styled from "styled-components"

import { FlexContainer, Title } from "../../../../../atoms"
import { colors, space } from "../../../../../../themes/theme"
import { COLOR_ARRAY } from "../../../../../../constants/visualizing-europe/wasteManagement"

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
  storedValues,
  margin,
  metric,
  width,
}) {
  const isPerc = metric === "perc"
  const halfWidth = width / 2
  const height = data && (isPerc ? data.data.length : data.data.length + 1) * 25
  const xScale = storedValues.current && storedValues.current.xScale
  return data ? (
    <TooltipContainer
      absPos
      left={
        xScale(data.data[0].year) -
        (xScale(data.data[0].year) <= halfWidth ? 15 : 124) +
        margin.left
      }
      isLeft={xScale(data.data[0].year) <= halfWidth}
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
          return (
            <FlexContainer
              key={el.metric}
              fullSize
              justify="space-between"
              withBorderBottom={
                !i && {
                  thickness: 1,
                  color: colors.gray,
                  style: "solid",
                }
              }
            >
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
