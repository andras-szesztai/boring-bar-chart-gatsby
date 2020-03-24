import React, { useState, useEffect } from "react"
import Select from "react-select"

import { GridContainer, FlexContainer, ColoredSpan, Container } from "../../../../atoms"
import AreaChart from "../AreaChart/AreaChart"
import { getAbsData, getPercentageData } from "../dashboardHelpers"
import { usePrevious } from "../../../../../hooks"
import constants, {
  DROPDOWN_STYLES,
  COLOR_ARRAY,
} from "../../../../../constants/visualizing-europe/wasteManagement"

export default function ComparisonChartContainer({
  selectedCountry,
  setSelectedCountry,
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
      <GridContainer columns="3fr 2fr">
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
          <GridContainer rows="repeat(3, min-content)" lineHeight={1.8}>
            <FlexContainer justify="flex-start">
              <div >
                In the European Union, the amount of{" "}
                <ColoredSpan
                  fontWeight="medium"
                  color="#fff"
                  paddingLeft={1}
                  paddingRight={1}
                  bgColor={COLOR_ARRAY[0]}
                >
                  municipal waste generated per person
                </ColoredSpan>{" "}
                in 2018 amounted to 488 kg, of which on average 147kg (30%) went
                through{" "}
                <ColoredSpan
                  fontWeight="medium"
                  color="#fff"
                  paddingLeft={1}
                  paddingRight={1}
                  bgColor={COLOR_ARRAY[1]}
                >
                  material recycling
                </ColoredSpan>
                , while 83kg (17%){" "}
                <ColoredSpan
                  fontWeight="medium"
                  color="#fff"
                  paddingLeft={1}
                  paddingRight={1}
                  bgColor={COLOR_ARRAY[2]}
                >
                  composting
                </ColoredSpan>
                .
              </div>
            </FlexContainer>
            <FlexContainer justify="flex-start">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Consequatur, modi!
            </FlexContainer>
            <FlexContainer justify="flex-start">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Consequatur, modi!
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
