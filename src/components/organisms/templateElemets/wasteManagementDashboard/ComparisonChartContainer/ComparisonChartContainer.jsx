import React, { useState, useEffect } from "react"
import styled, { css } from "styled-components"

import { GridContainer, FlexContainer, Title } from "../../../../atoms"
import AreaChart from "../AreaChart/AreaChart"
import { getAbsData, getPercentageData } from "../dashboardHelpers"
import { usePrevious } from "../../../../../hooks"
import constants from "../../../../../constants/visualizing-europe/wasteManagement"
import { IoMdArrowDropdown } from "react-icons/io"
import { transition, colors } from "../../../../../themes/theme"

const DropdownContainer = styled(FlexContainer)`
  transition: transform ${transition.md};
  ${({ isOpen }) =>
    isOpen
      ? css`
          transform: rotate(0deg);
        `
      : css`
          transform: rotate(180deg);
        `}
`

const CountryListContainer = styled(FlexContainer)`
  /* max-height: 200px;
  overflow-y: auto; */
`

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
  const [isOpen, setIsOpen] = useState(false)
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
      <FlexContainer
        justify="flex-start"
        pos="relative"
        cursor="pointer"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <Title fontSize={2}>
          {selectedCountry ? selectedCountry : "Please select a country"}
        </Title>
        <DropdownContainer isOpen={isOpen}>
          <IoMdArrowDropdown size={20} fill={colors.grayDarkest} />
        </DropdownContainer>
        <FlexContainer absPos top={25} withBorder>
          {isOpen && (
            <CountryListContainer
              zIndex="dropdown"
              direction="column"
              bgColor="white"
              paddingLeft={2}
              paddingTop={1}
              paddingBottom={1}
              paddingRight={4}
              align="flex-start"
            >
              {countryList.map(country => (
                <Title fontSize={2}>{country}</Title>
              ))}
            </CountryListContainer>
          )}
        </FlexContainer>
      </FlexContainer>
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
