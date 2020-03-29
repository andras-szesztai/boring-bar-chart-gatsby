import React from "react"
import styled from "styled-components"

import { GridContainer } from "../../../../atoms"
import DashboardTitle from "../DashboardTitle/DashboardTitle"
import DashboardExplainer from "../DashboardExplainer/DashboardExplainer"
import SwitchContainer from "../SwitchContainer/SwitchContainer"
import BigChartsContainer from "../BigChartsContainer/BigChartsContainer"
import SubChartsContainer from "../SubChartsContainer/SubChartsContainer"
import { themifySpace } from "../../../../../themes/mixins"

const MainGrid = styled(GridContainer)`
  grid-column-gap: 4rem;
  grid-row-gap: 2rem;
  @media (min-width: 450px) {
    height: 95%;
    width: 95%;
    grid-template-columns: 1fr;
    grid-template-rows: 20fr 20fr;
  }

  @media (min-width: 750px) {
    height: 95%;
    width: 96%;
    grid-template-columns: 30fr 70fr;
    grid-template-rows: 1fr;
  }

  @media (min-width: 1000px) {
    height: 95%;
    width: 96%;
    grid-template-columns: 32.5fr 67.5fr;
  }

  @media (min-width: 1400px) {
    height: 92.5%;
    width: 95%;
    grid-template-columns: 35fr 65fr;
  }
`

const MainChartsContainer = styled(GridContainer)`
  grid-column-gap: ${themifySpace(5)}px;
  @media (min-width: 450px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 20fr 80fr;
    grid-template-areas:
      "title title"
      "chartOne chartTwo";
  }

  @media (min-width: 750px) {
    grid-template-columns: 1fr;
    grid-template-rows: 16fr 42fr 42fr;
    grid-template-areas:
      "title"
      "chartOne"
      "chartTwo";
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
      {/* <MainChartsContainer fullSize gridArea="mainCharts">
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
      /> */}
    </MainGrid>
  )
}

export default DashboardBrowserView
