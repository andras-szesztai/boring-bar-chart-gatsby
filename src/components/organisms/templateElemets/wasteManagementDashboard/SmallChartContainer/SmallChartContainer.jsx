import React, { useState, useEffect } from "react"
import { FlexContainer } from "../../../../atoms"
import { usePrevious } from "../../../../../hooks"
import { AreaChart } from ".."

function getAbsData(data) {
  return data.map(el => ({
    ...el,
    recycling_composting: +el.recycling_composting,
    recycling_material: +el.recycling_material,
    recycling_total: +el.recycling_composting + +el.recycling_material,
    waste: +el.waste,
    yearString: el.year,
    year: new Date(+el.year),
  }))
}

function getPercentageData(data) {
  return data.map(el => {
    return {
      ...el,
      recycling_composting: +el.recycling_composting / +el.waste,
      recycling_material: +el.recycling_material / +el.waste,
      recycling_total:
        (+el.recycling_material + +el.recycling_composting) / +el.waste,
      waste: 1,
      yearString: el.year,
      year: new Date(+el.year),
    }
  })
}

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
