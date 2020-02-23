import React, { useState, useEffect } from "react"
import _ from "lodash"
import { IoMdArrowDropleft } from "react-icons/io"

import { FlexContainer, Title, ColoredSpan } from "../../atoms"
import {
  TrustBiasesChart,
  ColoredRects,
  MainContainer,
  ChartContainer,
  AxisContainerLeft,
  AxisContainerRight,
  AxisTextContainer,
  AbsPosContainer,
  ExpContainerLeft,
  ExpContainerRight,
  HintContainer,
} from "../../organisms/templateElemets/trustBiasesDashboard"
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
const gradientData = COLOR_RANGE.map((color, i) => ({
  offset: OFFSET_RANGE[i],
  color,
}))

const axisProps = {
  pos: "absolute",
  height: "calc(100% - 20px)",
  direction: "column",
  justify: "space-evenly",
}

const getCountryList = hoveredCountries =>
  COUNTRY_ORDER.map(country => (
    <AxisTextContainer
      key={country}
      fontWeight={hoveredCountries.includes(country) ? "semiBold" : "normal"}
    >
      {country}
    </AxisTextContainer>
  ))

export default function TrustBiases({ data }) {
  const [currHovered, setCurrHovered] = useState({})

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

  const isCurrHovered = !!Object.entries(currHovered).length

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
          {!isCurrHovered && (
            <HintContainer
              absPos
              width="150px"
              columns="20px auto"
              columnGap={0}
            >
              <FlexContainer align="flex-end">
                <IoMdArrowDropleft size={15} fill={colors.grayDarkest} />
              </FlexContainer>
              Hover over the elements to find out more!
            </HintContainer>
          )}
          <AbsPosContainer
            absPos
            topBig={32}
            topSmall={15}
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
          </AbsPosContainer>
          <AbsPosContainer
            absPos
            topBig={90}
            topSmall={75}
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
          </AbsPosContainer>
          <AbsPosContainer
            absPos
            topSmall={115}
            topBig={35}
            left={0}
            rows="repeat(2, 1fr)"
            rowGap={0}
            height="50px"
            direction="column"
          >
            {isCurrHovered && (
              <>
                <ColoredRects
                  currHovered={currHovered}
                  sameData={sameData}
                  accC="oColor"
                  accT="oTrust"
                  origin={currHovered.origin}
                  dest={currHovered.dest}
                  isTrust={currHovered.oTrust > 0}
                />
                {currHovered.origin !== currHovered.dest && (
                  <ColoredRects
                    currHovered={currHovered}
                    sameData={sameData}
                    accC="dColor"
                    accT="dTrust"
                    origin={currHovered.dest}
                    dest={currHovered.origin}
                    isTrust={currHovered.dTrust > 0}
                  />
                )}
              </>
            )}
          </AbsPosContainer>
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
          <ExpContainerLeft
            absPos
            bottom={25}
            width="100px"
            fontWeight="semiBold"
            textAlign="end"
          >
            {LEFT_TEXT}
          </ExpContainerLeft>
          <ExpContainerRight
            absPos
            bottom={25}
            width="100px"
            fontWeight="semiBold"
          >
            {RIGHT_TEXT}
          </ExpContainerRight>
        </FlexContainer>
        <FlexContainer justify="flex-start" fontColor="gray">
          {EXPLANATION}
        </FlexContainer>
        <CreditsContainer elements={CREDIT_ELEMENTS} absPos={false} />
      </MainContainer>
    </FlexContainer>
  )
}
