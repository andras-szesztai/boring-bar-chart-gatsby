import React, { useState, useEffect } from "react"
import ComparisonChartContainer from "../ComparisonChartContainer/ComparisonChartContainer"
import { GridContainer, FlexContainer, Title } from "../../../../atoms"
import AreaChart from "../AreaChart/AreaChart"
import { usePrevious } from "../../../../../hooks"
import { getAbsData, getPercentageData } from "../dashboardHelpers"

export default function BigChartsContainer({ selectedCountry, metric, data }) {
  const [chartData, setChartData] = useState(undefined)
  const prevMetric = usePrevious(metric)
  const prevSelectedCountry = usePrevious(selectedCountry)
  const [hoveredYear, setHoveredYear] = useState(undefined)

  useEffect(() => {
    if (!chartData && data) {
      setChartData(getAbsData(data["EU 28"]))
    }
    if (chartData && prevMetric !== metric) {
      setChartData(
        metric === "abs"
          ? getAbsData(data["EU 28"])
          : getPercentageData(data["EU 28"])
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

  const handleChartMouseover = d => setHoveredYear(d.yearString)
  const handleChartMouseout = () => setHoveredYear(undefined)

  return (
    <>
      <ComparisonChartContainer
        data={selectedCountry && data[selectedCountry]}
        metric={metric}
        selectedCountry={selectedCountry}
        handleChartMouseover={handleChartMouseover}
        handleChartMouseout={handleChartMouseout}
        hoveredYear={hoveredYear}
      />
      <GridContainer rows="30px 1fr" gridArea="chartTwo">
        <Title fontSize={2} >
          European Union Average
        </Title>
        <FlexContainer>
          <AreaChart
            data={chartData}
            metric={metric}
            value={selectedCountry}
            withAxes
            margin={{ top: 0, right: 0, bottom: 25, left: 25 }}
            isHoverable
            handleMouseover={handleChartMouseover}
            handleMouseout={handleChartMouseout}
            hoveredYear={hoveredYear}
          />
        </FlexContainer>
      </GridContainer>
    </>
  )
}
