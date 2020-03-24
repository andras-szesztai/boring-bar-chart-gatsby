import React, { useState, useEffect } from "react"
import Select from "react-select"

import { GridContainer, FlexContainer } from "../../../../atoms"
import AreaChart from "../AreaChart/AreaChart"
import { getAbsData, getPercentageData } from "../dashboardHelpers"
import { usePrevious } from "../../../../../hooks"
import constants from "../../../../../constants/visualizing-europe/wasteManagement"
import { colors } from "../../../../../themes/theme"

const customStyles = {
  option: (provided, state) => {
    console.log(state)
    console.log(provided)


    return {
      ...provided,
      color: state.isSelected ? "#fff" : colors.grayDarkest,
      backgroundColor: state.isSelected
        ? colors.grayDarkest
        : state.isFocused
        ? colors.grayLightest
        : "#fff",
      ':before':{
        backgroundColor: "red",
      }
    }
  },
}

export default function ComparisonChartContainer({
  selectedCountry,
  data,
  metric,
  handleChartMouseout,
  handleChartMouseover,
  hoveredYear,
  countryList,
}) {
  const [chartData, setChartData] = useState(undefined)
  const prevMetric = usePrevious(metric)
  const prevSelectedCountry = usePrevious(selectedCountry)

  useEffect(() => {
    const isAbs = metric === "abs"
    if (!chartData && data) {
      setChartData(isAbs ? getAbsData(data) : getPercentageData(data))
    }
    if (
      chartData &&
      (prevMetric !== metric || prevSelectedCountry !== selectedCountry)
    ) {
      setChartData(isAbs ? getAbsData(data) : getPercentageData(data))
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
      <GridContainer columns="repeat(2, 1fr)">
        {countryList && (
          <Select
            styles={customStyles}
            placeholder="Please select a country"
            isSearchable
            isClearable
            options={countryList.map(el => ({
              value: el,
              label: el,
            }))}
          />
        )}
      </GridContainer>
      {!selectedCountry ? (
        <FlexContainer>Explainer</FlexContainer>
      ) : (
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
      )}
    </GridContainer>
  )
}
