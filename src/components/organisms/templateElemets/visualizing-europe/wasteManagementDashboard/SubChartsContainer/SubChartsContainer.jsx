import React from "react"

import { GridContainer } from "../../../../../atoms"
import SmallChartContainer from "../SmallChartContainer/SmallChartContainer"

export default function SubChartsContainer({
  countryList,
  data,
  metric,
  selectedCountry,
  setSelectedCountry,
  modalIsOpen,
}) {
  return (
    <GridContainer columns="repeat(5, 1fr)" rows="repeat(5, 1fr)">
      {countryList &&
        countryList.map(country => (
          <SmallChartContainer
            modalIsOpen={modalIsOpen}
            key={country}
            value={country}
            data={data[country]}
            metric={metric}
            setSelected={setSelectedCountry}
            selectedValue={selectedCountry}
          />
        ))}
    </GridContainer>
  )
}
