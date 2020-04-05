import React, { useState, useEffect } from "react"
import styled from "styled-components"
import {
  MobileOnlyView,
  TabletView,
  BrowserView,
  withOrientationChange,
} from "react-device-detect"
import { format } from "date-fns"

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
    "total tNum date date date date slider slider slider slider"
    "no noNum barC barC barC barC percNo percNo percFfi percFfi"
    "no noNum barC barC barC barC percNo percNo percFfi percFfi"
    "ffi ffiNum barC barC barC barC percBar percBar percBar percBar"
    "ffi ffiNum barC barC barC barC percBar percBar percBar percBar";
`

function CoronaVirusHungaryDashboard({ data, loading }) {
  const [formattedData, setFormattedData] = useState(undefined)
  useEffect(() => {
    if (data && !formattedData) {
      setFormattedData(
        data.map(el => ({
          ...el,
          age: +el.kor,
          rand: +el.random,
          date: new Date(el.datum),
          number: +el.sorszam,
          gender: el.nem,
        }))
      )
    }
  }, [data, formattedData]);

  const [ numbers, setNumbers ] = useState({ total: 0, male: 0, female: 0 })

  console.log(formattedData);
  
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
            >
              Az új koronavírusban elhunytak száma, korban es nembeni eloszlása
              Magyarországon
            </FlexContainer>
            <FlexContainer fontSize={2} gridArea="source">
              Forrás:&nbsp;
              <LinkAnchor
                fontsize={2}
                fontWeight="thin"
                href="https://koronavirus.gov.hu/"
              >
                koronavirus.gov.hu
              </LinkAnchor>
            </FlexContainer>
            <FlexContainer
              fontSize={2}
              justify="flex-start"
              gridArea="total"
            >
              Összesen:
            </FlexContainer>
            <FlexContainer
              fontSize={2}
              fontWeight={3}
              gridArea="tNum"
            >
              {formattedData && formattedData.length}
            </FlexContainer>
            <FlexContainer
              fontSize={2}
              gridArea="date"
            >
              {format(new Date(), "Y'.' MM'.' dd'.'")}
            </FlexContainer>
            <FlexContainer withBorder gridArea="slider">
              Slider
            </FlexContainer>
            <FlexContainer
              justify="flex-start"
              fontSize={2}
              gridArea="no"
              fontColor={chartColors.female}
            >
              Nő
            </FlexContainer>
            <FlexContainer
              fontWeight={3}
              fontSize={2}
              gridArea="noNum"
              fontColor={chartColors.female}
            >
              {formattedData && formattedData.filter(({ gender }) => gender === "Nő").length}
            </FlexContainer>
            <FlexContainer
              justify="flex-start"
              fontSize={2}
              gridArea="ffi"
              fontColor={chartColors.male}
            >
              Férfi
            </FlexContainer>
            <FlexContainer
              gridArea="ffiNum"
              fontWeight={3}
              fontSize={2}
              fontColor={chartColors.male}
            >
              {formattedData && formattedData.filter(({ gender }) => gender === "Férfi").length}
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
            <FlexContainer withBorder gridArea="7/-1/-1/1">
              Chart
            </FlexContainer>
          </BrowserMainGrid>
        </FlexContainer>
      </BrowserView>
      <TabletView>Tablet</TabletView>
      <MobileOnlyView>Mobile</MobileOnlyView>
    </>
  )
}

export default withOrientationChange(CoronaVirusHungaryDashboard)
