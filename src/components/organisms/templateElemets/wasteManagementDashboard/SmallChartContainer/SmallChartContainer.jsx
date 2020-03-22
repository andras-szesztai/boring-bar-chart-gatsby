import React, { useState, useEffect } from "react"
import { FlexContainer } from "../../../../atoms"
import { usePrevious } from "../../../../../hooks"
import { AreaChart } from ".."
import { getPercentageData, getAbsData } from "../dashboardHelpers"

export default function SmallChartContainer({
  value,
  data,
  setSelected,
  selectedValue,
  metric
}) {
  const isSelected = selectedValue === value
  const [isHovered, setIsHovered] = useState(false)
  const [chartData, setChartData] = useState(undefined)
  const prevMetric = usePrevious(metric)

  useEffect(() => {
    if (!chartData && data) {
      setChartData(getAbsData(data))
    }
    if (prevMetric !== metric) {            
      setChartData(
        metric === "abs" ? getAbsData(data) : getPercentageData(data)
      )
    }
  }, [chartData, data, metric, prevMetric])


  return (
    <>
      <FlexContainer
        pos="relative"
        onClick={() => selectedValue !== value && setSelected(value)}
        cursor={!isSelected ? "pointer" : "auto"}
      >
        <FlexContainer
          absPos
          zIndex="loader"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          bgColor={isHovered && !isSelected && "grayLightest"}
          borderRadius={1}
          fullSize
          opacity={!isSelected ? 0.25 : 1}
          borderColor={isSelected && "grayLightest"}
          hoverable
        />
          <AreaChart data={chartData} metric={metric} value={value}/>
      </FlexContainer>
    </>
  )
}
