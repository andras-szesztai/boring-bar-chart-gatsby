import React from "react"
import styled from "styled-components"
import {
  MobileOnlyView,
  TabletView,
  BrowserView,
  withOrientationChange,
} from "react-device-detect"

import { FlexContainer, GridContainer, LinkAnchor } from "../../atoms"
import { space } from "../../../themes/theme"
import { chartColors } from "../../../constants/visualizations/coronavirusHungary"

const BrowserMainGrid = styled(GridContainer)`
  max-width: 1400px;
  width: 95vw;

  max-height: 700px;
  height: 95vh;

  grid-template-columns: repeat(10, 5fr);
  grid-template-rows: min-content repeat(10, 1fr);
  grid-row-gap: ${space[1]}px;
  grid-column-gap: ${space[1]}px;
  grid-template-areas:
    "title title title title title title source source source source"
    "total total total date date date slider slider slider slider"
    "no noNum barC barC barC barC percNo percNo percFfi percFfi"
    "no noNum barC barC barC barC percNo percNo percFfi percFfi"
    "ffi ffiNum barC barC barC barC percBar percBar percBar percBar"
    "ffi ffiNum barC barC barC barC percBar percBar percBar percBar";
`

function CoronaVirusHungaryDashboard({ data, loading }) {
  return (
    <>
      <BrowserView>
        <FlexContainer fullScreen>
          <BrowserMainGrid>
            <FlexContainer
              gridArea="title"
              justify="flex-start"
              fontSize={4}
              fontWeight="ultraLight"
              lineHeight={1.2}
              withBorder
            >
              Magyarországon az új koronavírusban elhunytak száma, korban es
              nembeni eloszlása
            </FlexContainer>
            <FlexContainer fontSize={2} gridArea="source" withBorder>
              Forrás:&nbsp;<LinkAnchor fontsize={2} fontWeight="thin" href="https://koronavirus.gov.hu/" >koronavirus.gov.hu</LinkAnchor> 
            </FlexContainer>
            <FlexContainer
              withBorder
              fontSize={2}
              justify="flex-start"
              gridArea="total"
            >
              Total:
            </FlexContainer>
            <FlexContainer
              withBorder
              fontSize={2}
              fontWeight={3}
              gridArea="date"
            >
              Datum
            </FlexContainer>
            <FlexContainer withBorder gridArea="slider">
              Slider
            </FlexContainer>
            <FlexContainer
              withBorder
              justify="flex-start"
              fontSize={2}
              gridArea="no"
              fontColor={chartColors.female}
            >
              No
            </FlexContainer>
            <FlexContainer
              withBorder
              fontWeight={3}
              fontSize={2}
              gridArea="noNum"
              fontColor={chartColors.female}
            >
              14
            </FlexContainer>
            <FlexContainer
              withBorder
              justify="flex-start"
              fontSize={2}
              gridArea="ffi"
              fontColor={chartColors.male}
            >
              Ferfi
            </FlexContainer>
            <FlexContainer
              withBorder
              gridArea="ffiNum"
              fontWeight={3}
              fontSize={2}
              fontColor={chartColors.male}
            >
              21
            </FlexContainer>
            <FlexContainer withBorder gridArea="barC">
              Bar chart
            </FlexContainer>

            <FlexContainer
              withBorder
              gridArea="percNo"
              fontWeight={3}
              fontSize={2}
              fontColor={chartColors.female}
            >
              35%
            </FlexContainer>

            <FlexContainer
              withBorder
              gridArea="percFfi"
              fontWeight={3}
              fontSize={2}
              fontColor={chartColors.male}
            >
              65%
            </FlexContainer>
            <FlexContainer withBorder gridArea="percBar">
              Bar chart
            </FlexContainer>
            <FlexContainer withBorder gridArea="7/-1/-1/1" >Chart</FlexContainer>
          </BrowserMainGrid>
        </FlexContainer>
      </BrowserView>
      <TabletView>Tablet</TabletView>
      <MobileOnlyView>Mobile</MobileOnlyView>
    </>
  )
}

export default withOrientationChange(CoronaVirusHungaryDashboard)
