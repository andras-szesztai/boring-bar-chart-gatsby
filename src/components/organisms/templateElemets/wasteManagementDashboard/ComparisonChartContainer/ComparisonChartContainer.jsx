import React, { useState, useEffect } from "react"
import { GridContainer, FlexContainer } from "../../../../atoms"
import AreaChart from "../AreaChart/AreaChart"
import { getAbsData, getPercentageData } from "../dashboardHelpers"
import { usePrevious } from "../../../../../hooks"

export default function ComparisonChartContainer({
  selectedCountry,
  data,
  metric,
}) {
  const [chartData, setChartData] = useState(undefined)
  const prevMetric = usePrevious(metric)
  const prevSelectedCountry = usePrevious(selectedCountry)

  useEffect(() => {
    if (!chartData && data) {
      setChartData(getAbsData(data))
    }
    if (
      chartData &&
      (prevMetric !== metric || prevSelectedCountry !== selectedCountry)
    ) {
      setChartData(
        metric === "abs" ? getAbsData(data) : getPercentageData(data)
      )
    }
  }, [
    chartData,
    data,
    metric,
    prevMetric,
    prevSelectedCountry,
    selectedCountry,
  ])
  
  return (
    <GridContainer rows="30px 1fr" gridArea="chartOne">
      <FlexContainer>Selector</FlexContainer>
      {!selectedCountry ? (
        <FlexContainer>Explainer</FlexContainer>
      ) : (
        <FlexContainer>
          <AreaChart
            data={chartData}
            metric={metric}
            value={selectedCountry}
            withAxes
            margin={{ top: 0, right: 0, bottom: 25, left: 25 }}
          />
        </FlexContainer>
      )}
    </GridContainer>
  )
}
