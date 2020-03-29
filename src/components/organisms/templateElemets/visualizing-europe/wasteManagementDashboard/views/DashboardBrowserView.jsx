import React from "react"
import styled from "styled-components"

import { GridContainer } from "../../../../atoms"
import DashboardTitle from "../DashboardTitle/DashboardTitle"
import DashboardExplainer from "../DashboardExplainer/DashboardExplainer"
import SwitchContainer from "../SwitchContainer/SwitchContainer"
import BigChartsContainer from "../BigChartsContainer/BigChartsContainer"
import SubChartsContainer from "../SubChartsContainer/SubChartsContainer"

const MainGrid = styled(GridContainer)`
  height: 96%;
  width: 95%;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, 1fr);
  grid-row-gap: 2rem;
  grid-column-gap: 0rem;

  @media (min-width: 800px) {
    height: 95%;
    max-height: 700px;
    width: 97%;
    max-width: 1440px;
    grid-template-rows: 1fr;
    grid-template-columns: 35fr 65fr;
    grid-row-gap: 0rem;
    grid-column-gap: 5rem;
  }
`

const MainChartsContainer = styled(GridContainer)`
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: min-content 1fr 10fr;
  grid-column-gap: 3rem;
  grid-template-areas:
    "title helper"
    "switch switch"
    "chartOne chartTwo";

  @media (min-width: 800px) {
    grid-template-rows: min-content 1fr repeat(2, 5fr);
    grid-template-columns: 2fr 1fr;
    grid-template-areas:
      "title helper"
      "switch switch"
      "chartOne chartOne"
      "chartTwo chartTwo";
  }
`

function DashboardBrowserView({
  metric,
  setMetric,
  data,
  countryList,
  selectedCountry,
  setSelectedCountry,
}) {
  return (
    <MainGrid>
      <MainChartsContainer fullSize>
        <DashboardTitle />
        <DashboardExplainer />
        <SwitchContainer
          metric={metric}
          setMetric={setMetric}
          justify="flex-start"
        />
        <BigChartsContainer
          metric={metric}
          data={data}
          countryList={countryList}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
      </MainChartsContainer>
      <SubChartsContainer
        metric={metric}
        data={data}
        countryList={countryList}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
    </MainGrid>
  )
}

export default DashboardBrowserView
