import React from "react"
import Modal from "react-modal"
import { IoMdInformationCircle } from "react-icons/io"

import { GridContainer, FlexContainer, Container } from "../../../../atoms"
import { space, colors } from "../../../../../themes/theme"
import LineChart from "../LineChart/LineChart"
import Number from "../Number/Number"
import {
  TEXT,
  chartColors,
} from "../../../../../constants/visualizations/coronavirusHungary"
import AgeChartBrowser from "../AgeChartBrowser/AgeChartBrowser"
import AreaChart from "../AreaChart/AreaChart"
import VerticalDoubleAreaChart from "../DoubleAreaChart/VerticalDoubleAreaChart/VerticalDoubleAreaChart"

Modal.setAppElement("#___gatsby")

export default function CardGrid({
  onlyChart,
  title,
  data,
  currDate,
  area,
  language,
  type,
  device,
  fullListDomain,
  isPortrait,
  setIsModal,
}) {
  const currNumbers =
    data &&
    currDate &&
    !onlyChart &&
    data.filter(({ date }) => currDate.toString() === date.toString())

  const isRunningLessThanMinDate =
    area === "daily" &&
    currDate <
      new Date(
        "Thu Mar 26 2020 00:00:00 GMT+0100 (Central European Standard Time)"
      )

  const isMobile = device === "mobile"
  const isDesktop = device === "desktop"
  const isFront = type === "front"
  const deviceAccessor = device === "desktop" ? device : "mobile"
  const isRatioFront = area === "ratio" && isFront
  const mobilePortrait = onlyChart && isMobile && isPortrait
  return (
    <GridContainer
      style={{ padding: `${space[2]}px ${space[3]}px` }}
      fullSize
      textAlign="left"
      rows={
        onlyChart
          ? !isDesktop
            ? "1fr 30px"
            : "35px 1fr 30px"
          : isMobile && isPortrait
          ? "min-content 1fr 80px 30px"
          : "45px 1fr 80px 30px"
      }
    >
      {!onlyChart && (
        <FlexContainer
          justify="flex-start"
          align="flex-start"
          onClick={e => {
            if (!onlyChart) {
              setIsModal(area)
              e.stopPropagation()
            }
          }}
        >
          <Container textAlign="left" fontSize={2}>
            {title}{" "}
            <div
              style={{
                display: "inline-block",
                transform: "translate(2px, 4px)",
              }}
            >
              <IoMdInformationCircle size={16} color={colors.grayDarkest} />
            </div>
          </Container>
        </FlexContainer>
      )}
      <FlexContainer
        marginTop={mobilePortrait && 6}
        marginBottom={mobilePortrait && 4}
      >
        {!isRatioFront ? (
          !onlyChart ? (
            <LineChart
              key={type + area}
              data={data}
              currDate={currDate}
              isPercentage={area === "ratio"}
              noTransition={!isDesktop}
            />
          ) : isDesktop ? (
            <AgeChartBrowser
              key={type + area}
              data={data}
              language={language}
              isCombined={type === "front"}
            />
          ) : (
            <GridContainer
              fullSize
              rows={isFront || mobilePortrait ? "1fr" : "repeat(2, 1fr)"}
            >
              {isFront ? (
                <FlexContainer fullSize>
                  {!mobilePortrait ? (
                    <AreaChart
                      key="combinedArea"
                      data={data}
                      accessor="total"
                      fullListDomain={fullListDomain}
                      language={language}
                      isCombined={true}
                    />
                  ) : (
                    <VerticalDoubleAreaChart
                      key="double-total"
                      data={data}
                      language={language}
                      fullListDomain={fullListDomain}
                      isCombined={true}
                    />
                  )}
                </FlexContainer>
              ) : mobilePortrait ? (
                <VerticalDoubleAreaChart
                  key="double-gender"
                  data={data}
                  language={language}
                  fullListDomain={fullListDomain}
                />
              ) : (
                <>
                  <FlexContainer>
                    <AreaChart
                      key="femaleArea"
                      data={
                        data &&
                        data.filter(
                          ({ gender }) => gender === TEXT.accessorF[language]
                        )
                      }
                      accessor="female"
                      fullListDomain={fullListDomain}
                      language={language}
                    />
                  </FlexContainer>
                  <FlexContainer>
                    <AreaChart
                      key="femaleArea"
                      data={
                        data &&
                        data.filter(
                          ({ gender }) => gender === TEXT.accessorM[language]
                        )
                      }
                      accessor="male"
                      fullListDomain={fullListDomain}
                      language={language}
                    />
                  </FlexContainer>
                </>
              )}
            </GridContainer>
          )
        ) : (
          <FlexContainer fontSize={2} paddingLeft={3} paddingRight={3}>
            {TEXT.ratioFront[deviceAccessor][language]}
          </FlexContainer>
        )}
      </FlexContainer>
      {!onlyChart && (
        <GridContainer
          rows={
            currNumbers &&
            (currNumbers.length > 1 && !isRunningLessThanMinDate
              ? "repeat(2, 1fr)"
              : "1fr")
          }
        >
          {currNumbers &&
            (!isRunningLessThanMinDate ? (
              currNumbers.map(({ key, value }) => (
                <GridContainer columns="repeat(2, 1fr)" key={key + area}>
                  <FlexContainer fontSize={2} fontColor={chartColors[key]}>
                    {TEXT[key][language]}:
                  </FlexContainer>
                  <FlexContainer
                    fontSize={3}
                    fontWeight="light"
                    fontColor={chartColors[key]}
                  >
                    <Number
                      num={value}
                      isPercentage={area === "ratio"}
                      oneDecimal={area === "age"}
                      noAnimate={!isDesktop}
                    />
                    {area === "age"
                      ? `‎‎‏‏‎ ‎${TEXT.tooltipYear[language]}`
                      : ""}
                  </FlexContainer>
                </GridContainer>
              ))
            ) : (
              <FlexContainer fontSize={2}>
                {TEXT.dailyBefore[language]}
              </FlexContainer>
            ))}
        </GridContainer>
      )}
      <FlexContainer>
        {area !== "ratio" &&
          TEXT.cardExplanation[deviceAccessor][type][language]}
      </FlexContainer>
    </GridContainer>
  )
}
