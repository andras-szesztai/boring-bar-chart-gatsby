import React, { useState, useEffect } from "react"
import Select from "react-select"

import { GridContainer, FlexContainer, ColoredSpan } from "../../../../atoms"
import AreaChart from "../AreaChart/AreaChart"
import { getAbsData, getPercentageData } from "../dashboardHelpers"
import { usePrevious } from "../../../../../hooks"
import constants, {
  DROPDOWN_STYLES,
  COLOR_ARRAY,
} from "../../../../../constants/visualizing-europe/wasteManagement"
import LegendSpan from "../LegendSpan/LegendSpan"
import { colors } from "../../../../../themes/theme"

export default function ComparisonChartContainer({
  selectedCountry,
  setSelectedCountry,
  data,
  metric,
  handleChartMouseout,
  handleChartMouseover,
  hoveredYear,
  countryList,
  isSmallScreen,
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
      data &&
      chartData &&
      (prevMetric !== metric || prevSelectedCountry !== selectedCountry)
    ) {
      setChartData(isAbs ? getAbsData(data) : getPercentageData(data))
    }
    if (!data && chartData) {
      setChartData(undefined)
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
    <GridContainer rows="40px 1fr" gridArea="chartOne">
      <GridContainer>
        {countryList && (
          <Select
            styles={DROPDOWN_STYLES}
            placeholder="Please select a country"
            value={
              selectedCountry && {
                value: selectedCountry,
                label: selectedCountry,
              }
            }
            onChange={v =>
              v ? setSelectedCountry(v.label) : setSelectedCountry(undefined)
            }
            isClearable
            options={countryList.map(el => ({
              value: el,
              label: el,
            }))}
          />
        )}
      </GridContainer>
      {!selectedCountry ? (
        <FlexContainer>
          <GridContainer rows="repeat(2, min-content)" lineHeight={1.8}>
            <FlexContainer justify="flex-start">
              <div>
                In the European Union, the amount of{" "}
                <LegendSpan color={COLOR_ARRAY[0]}>municipal waste</LegendSpan>{" "}
                generated per person in 2018 amounted to 488 kg, of which on
                average 147kg (30%) went through{" "}
                <LegendSpan color={COLOR_ARRAY[1]}>
                  material recycling
                </LegendSpan>
                , while 83kg (17%){" "}
                <LegendSpan color={COLOR_ARRAY[2]}>composting</LegendSpan>.
              </div>
            </FlexContainer>
            <FlexContainer justify="flex-start">
              <div>
                Explore how much per capita municipal waste-generation evolved
                in individual countries (inside or outside of the EU) between
                1995 and 2018, and how much of that waste on average got
                recycled year by year? 
                {isSmallScreen
                  ? "Use the selector above to find out more!"
                  : "Click on a country or use the selector above to find out more!"}
              </div>
            </FlexContainer>
          </GridContainer>
        </FlexContainer>
      ) : (
        <FlexContainer>
          <AreaChart
            data={chartData}
            metric={metric}
            value={selectedCountry}
            withAxes
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
