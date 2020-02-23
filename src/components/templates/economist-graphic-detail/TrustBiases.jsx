import React, { useState, useEffect } from "react"
import styled from "styled-components"
import chroma from "chroma-js"
import _ from "lodash"

import { FlexContainer, GridContainer, Title, ColoredSpan } from "../../atoms"
import { TrustBiasesChart } from "../../organisms/templateElemets/trustBiasesDashboard"

import {
  COUNTRY_ORDER,
  TEXTS,
  COLOR_RANGE,
  COLOR_DOMAIN,
  OFFSET_RANGE,
  LEGEND_END_TEXTS,
  CREDIT_ELEMENTS,
} from "../../../constants/trustBiases"
import { HorizontalLinearGradient } from "../../organisms"
import { CreditsContainer, FullScreenLoader } from "../../molecules"
import { colors } from "../../../themes/theme"

const { TITLE, EXPLANATION, LEFT_TEXT, RIGHT_TEXT } = TEXTS
const trustColor = COLOR_RANGE[3]
const distrustColor = COLOR_RANGE[0]
const gradientData = COLOR_RANGE.map((color, i) => ({
  offset: OFFSET_RANGE[i],
  color,
}))

const MainContainer = styled(GridContainer)`
  height: 700px;
  width: 700px;
  @media (max-width: 768px) {
    width: 600px;
  }
  @media (max-width: 620px) {
    width: 450px;
  }
`

const ChartContainer = styled(FlexContainer)`
  height: 370px;
  width: 370px;
  transform: rotate(45deg);
  @media (max-width: 768px) {
    height: 325px;
    width: 325px;
  }
  @media (max-width: 620px) {
    height: 280px;
    width: 280px;
  }
`

const AxisContainerLeft = styled(FlexContainer)`
  top: 220px;
  transform: rotate(-90deg);
  width: 50px;
  @media (max-width: 768px) {
    top: 200px;
  }
  @media (max-width: 620px) {
    top: 175px;
  }
`

const AxisContainerRight = styled(FlexContainer)`
  left: 100%;
`

const axisProps = {
  pos: "absolute",
  height: "calc(100% - 20px)",
  direction: "column",
  justify: "space-evenly",
}

const getCountryList = hoveredCountries =>
  COUNTRY_ORDER.map(country => (
    <FlexContainer
      fontWeight={hoveredCountries.includes(country) ? "semiBold" : "normal"}
    >
      {country}
    </FlexContainer>
  ))

export default function TrustBiases({ data }) {
  const [currHovered, setCurrHovered] = useState({})

  const getFontColor = color =>
    color &&
    (chroma(color).luminance() > 0.5
      ? chroma(color)
          .darken(3)
          .hex()
      : chroma(color)
          .brighten(3)
          .hex())

  const [sameData, setSameData] = useState(undefined)
  useEffect(() => {
    if (!sameData && data) {
      setSameData(
        _.mean(
          data
            .filter(d => d.destination === d.origin && +d.trust !== 100)
            .map(d => +d.trust)
        )
      )
    }
  }, [data, sameData])

  const ColoredRects = ({ accC, accT, origin, dest, isTrust }) => {
    return (
      currHovered[accT] !== 100 && (
        <GridContainer columns="45px auto">
          <FlexContainer
            bgColor={currHovered[accC]}
            fontWeight="semiBold"
            fontColor={getFontColor(currHovered[accC])}
          >
            {currHovered[accT]}
          </FlexContainer>
          <FlexContainer justify="flex-start">
            <div>
              <ColoredSpan fontWeight="semiBold">{origin} </ColoredSpan> tends
              to{" "}
              <ColoredSpan
                color={isTrust ? trustColor : distrustColor}
                fontWeight="semiBold"
              >
                {isTrust ? "trust" : "distrust"}
              </ColoredSpan>{" "}
              {dest === origin
                ? currHovered[accT] > sameData
                  ? "itself above average"
                  : "itself below average"
                : dest}
            </div>
          </FlexContainer>
        </GridContainer>
      )
    )
  }

  return (
    <FlexContainer height="750px" width="100vw">
      <FullScreenLoader />
      <MainContainer rows="30px 1fr 40px 20px">
        <FlexContainer justify="flex-start">
          <Title fontWeight="semiBold" fontSize={2}>
            {TITLE}
          </Title>
        </FlexContainer>
        <FlexContainer pos="relative">
          <GridContainer
            absPos
            top={32}
            right={0}
            height="45px"
            width="225px"
            columns="85px 140px"
            columnGap={0}
          >
            <FlexContainer justify="flex-end">
              <div>
                <ColoredSpan fontWeight="semiBold">Trust bias, </ColoredSpan>%
                pts
              </div>
            </FlexContainer>
            <FlexContainer>
              <HorizontalLinearGradient
                data={gradientData}
                colorDomain={COLOR_DOMAIN}
                colorRange={COLOR_RANGE}
                endTexts={LEGEND_END_TEXTS}
              />
            </FlexContainer>
          </GridContainer>
          <GridContainer
            absPos
            top={90}
            right={0}
            height="20px"
            width="125px"
            columns="20px auto"
            columnGap={2}
          >
            <FlexContainer
              justify="flex-end"
              bgColor={colors.grayLighter}
              fullSize
              style={{ transform: "rotate(45deg)" }}
            />
            <FlexContainer justify="flex-start">
              No data available
            </FlexContainer>
          </GridContainer>
          <GridContainer
            absPos
            top={35}
            left={0}
            rows="repeat(2, 1fr)"
            rowGap={0}
            height="50px"
            direction="column"
          >
            {!!Object.entries(currHovered).length && (
              <>
                <ColoredRects
                  accC="oColor"
                  accT="oTrust"
                  origin={currHovered.origin}
                  dest={currHovered.dest}
                  isTrust={currHovered.oTrust > 0}
                />
                {currHovered.origin !== currHovered.dest && (
                  <ColoredRects
                    accC="dColor"
                    accT="dTrust"
                    origin={currHovered.dest}
                    dest={currHovered.origin}
                    isTrust={currHovered.dTrust > 0}
                  />
                )}
              </>
            )}
          </GridContainer>
          <ChartContainer pos="relative">
            <AxisContainerLeft {...axisProps} align="flex-end">
              {getCountryList(Object.values(currHovered))}
            </AxisContainerLeft>
            <AxisContainerRight {...axisProps} align="flex-start">
              {getCountryList([])}
            </AxisContainerRight>
            <TrustBiasesChart
              data={data}
              colorDomain={COLOR_DOMAIN}
              colorRange={COLOR_RANGE}
              handleMouseover={curr =>
                currHovered !== curr && setCurrHovered(curr)
              }
              handleMouseout={() => setCurrHovered({})}
            />
          </ChartContainer>
          <FlexContainer
            absPos
            bottom={25}
            left={40}
            width="100px"
            fontWeight="semiBold"
            textAlign="end"
          >
            {LEFT_TEXT}
          </FlexContainer>
          <FlexContainer
            absPos
            bottom={25}
            right={40}
            width="100px"
            fontWeight="semiBold"
          >
            {RIGHT_TEXT}
          </FlexContainer>
        </FlexContainer>
        <FlexContainer justify="flex-start" fontColor="gray">
          {EXPLANATION}
        </FlexContainer>
        <CreditsContainer elements={CREDIT_ELEMENTS} absPos={false} />
      </MainContainer>
    </FlexContainer>
  )
}
