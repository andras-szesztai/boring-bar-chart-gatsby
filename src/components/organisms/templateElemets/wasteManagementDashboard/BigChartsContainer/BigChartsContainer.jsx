import React, { useState, useEffect } from "react"
import ComparisonChartContainer from "../ComparisonChartContainer/ComparisonChartContainer"
import { GridContainer, FlexContainer, Title } from "../../../../atoms"
import AreaChart from "../AreaChart/AreaChart"
import { usePrevious } from "../../../../../hooks"
import { getAbsData, getPercentageData } from "../dashboardHelpers"
import constants from "../../../../../constants/visualizing-europe/wasteManagement"

export default function BigChartsContainer({ selectedCountry, metric, data, countryList, setSelectedCountry }) {
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
        setSelectedCountry={setSelectedCountry}
        handleChartMouseover={handleChartMouseover}
        handleChartMouseout={handleChartMouseout}
        hoveredYear={hoveredYear}
        countryList={countryList}
      />
      <GridContainer rows="40px 1fr" gridArea="chartTwo">
        <Title fontSize={2} >
          European Union (28) Average
        </Title>
        <FlexContainer>
          <AreaChart
            data={chartData}
            metric={metric}
            value={selectedCountry}
            withAxes
            margin={constants.CHART_MARGIN}
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
