import React, { useState, useEffect, useRef } from "react"
import Image from "gatsby-image"
import Range from "rc-slider/lib/Range"
import _ from "lodash"
import "rc-slider/assets/index.css"
import { IoIosHelpCircle } from "react-icons/io"

import {
  FlexContainer,
  GridContainer,
  CheckBox,
  SelectAllText,
  SortableHandle,
  Title,
  LinkAnchor,
} from "../atoms"
import {
  SortableComponent,
  CountUpSpan,
  HorizontalMultiSelect,
  CarouselContainer,
  VerticalBarCircleChart,
  ModalContainer,
  CreditsContainer,
} from "../molecules"
import {
  ParallelBoxPlotColumn,
  HorizontalStackedBarChartContainer,
} from "../organisms"
import { colors } from "../../themes/theme"
import { Container } from "../atoms/containers"
import { usePrevious, useArrayRefs, useModalToggle } from "../../hooks"
import { max, quantile, extent } from "d3-array"
import TooltipContainer from "../molecules/containers/TooltipContainer"

const { grayLightest, grayDarkest } = colors

const COLOR_RANGE = ["#fc5050", "#FCD432", "#415f77"]
const SYNCED_CHECKBOXES = ["elo", "moves"]
const CAROUSEL_PAGES = [
  "Bio",
  "Number of Games in Dataset",
  "Average ELO Score",
  "Maximum ELO Score",
]
const flexEndObject = { justify: "flex-start" }
const CREDIT_ELEMENTS = [
  {
    ...flexEndObject,
    text: "Designed and built by",
    link: "https://twitter.com/AndSzesztai",
    anchorText: "András Szesztai",
  },
  {
    ...flexEndObject,
    text: "Project",
    link: "https://www.boringbarchart.com/",
    anchorText: "BoringBarChart",
  },
  {
    ...flexEndObject,
    text: "Data source",
    link: "https://www.chess.com/games",
    anchorText: "chess.com",
  },
]

const BOX_PLOT_EXPLAIN = [
  {
    title: "Median (Q2/50th Percentile)",
    text: "the middle value of the dataset",
  },
  {
    title: "First quartile (Q1/25th Percentile)",
    text:
      "the middle number between the smallest number (not the “minimum”) and the median of the dataset",
  },
  {
    title: "Third quartile (Q3/75th Percentile)",
    text:
      "the middle value between the median and the highest value (not the “maximum”) of the dataset",
  },
  { title: "Interquartile range (IQR)", text: "25th to the 75th percentile." },
  { title: "Maximum", text: "Q3 + 1.5*IQR" },
  { title: "Minimum", text: "Q1 -1.5*IQR" },
]

function getBoxPlotData(sorted) {
  const min = sorted[0]
  const max = sorted[sorted.length - 1]
  const q1 = quantile(sorted, 0.25)
  const median = quantile(sorted, 0.5)
  const q3 = quantile(sorted, 0.75)
  const iqr = q3 - q1
  const r0 = Math.max(min, q1 - iqr * 1.5)
  const r1 = Math.min(max, q3 + iqr * 1.5)
  return {
    q1,
    median,
    q3,
    r0,
    r1,
  }
}

function getPeriodFilteredData(data, period) {
  const q = data.length / 4
  const startIndex = period[0] * q
  const endIndex = period[1] * q

  const periodFilteredData = _.slice(data, startIndex, endIndex)
  return periodFilteredData
}

const getResultFilteredData = (data, results) =>
  data.filter(d => results.includes(d.result))

function checkUncheckAll(bool, keys) {
  let checkArray = {}
  keys.forEach(key => (checkArray = { ...checkArray, [key]: bool }))
  return checkArray
}

export default function({ data }) {
  const [dataKeys, setDataKeys] = useState(undefined)

  useEffect(() => {
    if (!dataKeys) {
      setDataKeys(data.map(({ nameId }) => nameId))
    }
  }, [dataKeys, data])

  const [checkedObject, setCheckedObject] = useState(undefined)
  const prevCheckedObject = usePrevious(checkedObject)
  useEffect(() => {
    if (dataKeys && !checkedObject) {
      setCheckedObject(checkUncheckAll(true, dataKeys))
    }
  }, [dataKeys, data, checkedObject])

  const [syncObject, setSyncObject] = useState({
    elo: true,
    moves: true,
  })

  const [mouseOver, setMouseOver] = useState(undefined)
  const mouseOverValue = useRef()

  const [resultCheckedObject, setResultCheckedObject] = useState({
    Lose: true,
    Draw: true,
    Win: true,
  })
  const prevResultCheckedObject = usePrevious(resultCheckedObject)
  const [period, setPeriod] = useState([0, 4])
  const prevPeriod = usePrevious(period)

  const sortSet = (set, sortBy) => set.map(d => d[sortBy]).sort((a, b) => a - b)

  const getRange = object => ({
    ...object,
    eloRange: extent(object.eloMinMax),
    movesRange: extent(object.movesMinMax),
  })

  const [dataSets, setDataSets] = useState(undefined)
  const prevDataSets = usePrevious(dataSets)
  useEffect(() => {
    if (!dataSets && dataKeys) {
      let object = { movesMinMax: [], eloMinMax: [] }
      dataKeys.forEach(key => {
        const set = data.find(d => d.nameId === key).dataSet
        const eloBoxPlot = getBoxPlotData(sortSet(set, "opponent_elo"))
        const movesBoxPlot = getBoxPlotData(sortSet(set, "moves"))
        object = {
          ...object,
          eloMinMax: [...object.eloMinMax, eloBoxPlot.r0, eloBoxPlot.r1],
          movesMinMax: [
            ...object.movesMinMax,
            movesBoxPlot.r0,
            movesBoxPlot.r1,
          ],
          [key]: {
            unfiltered: set,
            periodFiltered: set,
            periodResultFiltered: set,
            unfilteredEloBoxPlot: {
              ...eloBoxPlot,
            },
            eloBoxPlot: {
              ...eloBoxPlot,
            },
            unfilteredMovesBoxPlot: {
              ...movesBoxPlot,
            },
            movesBoxPlot: {
              ...movesBoxPlot,
            },
          },
        }
      })
      setDataSets(getRange(object))
    }
  }, [data, dataKeys, dataSets])

  // Filtering on change
  useEffect(() => {
    function getNewDatasets(unfiltered, isUnchecked) {
      const periodResultFiltered = !isUnchecked
        ? getPeriodFilteredData(
            getResultFilteredData(
              unfiltered,
              Object.keys(resultCheckedObject).filter(
                k => resultCheckedObject[k]
              )
            ),
            period
          )
        : unfiltered
      return {
        periodResultFiltered,
        eloBoxPlot: {
          ...getBoxPlotData(sortSet(periodResultFiltered, "opponent_elo")),
        },
        movesBoxPlot: {
          ...getBoxPlotData(sortSet(periodResultFiltered, "moves")),
        },
      }
    }

    const getNewMinMax = accessor => [accessor.r0, accessor.r1]

    if (dataSets && prevPeriod && !_.isEqual(period, prevPeriod)) {
      let newDataSets = { movesMinMax: [], eloMinMax: [] }
      dataKeys.forEach(key => {
        const isChecked = checkedObject[key]
        const sets = dataSets[key]
        const unfiltered = sets.unfiltered
        const newObject = isChecked ? getNewDatasets(unfiltered) : sets
        newDataSets = {
          ...newDataSets,
          eloMinMax: [
            ...newDataSets.eloMinMax,
            ...getNewMinMax(newObject.eloBoxPlot),
          ],
          movesMinMax: [
            ...newDataSets.movesMinMax,
            ...getNewMinMax(newObject.movesBoxPlot),
          ],
          [key]: {
            ...sets,
            periodFiltered: isChecked
              ? getPeriodFilteredData(unfiltered, period)
              : unfiltered,
            ...newObject,
          },
        }
        setDataSets(getRange(newDataSets))
      })
    }

    if (
      dataSets &&
      prevResultCheckedObject &&
      !_.isEqual(resultCheckedObject, prevResultCheckedObject)
    ) {
      let newDataSets = { movesMinMax: [], eloMinMax: [] }
      dataKeys.forEach(key => {
        const isChecked = checkedObject[key]
        const sets = dataSets[key]
        const unfiltered = sets.unfiltered
        const newObject = isChecked ? getNewDatasets(unfiltered) : sets
        newDataSets = {
          ...newDataSets,
          eloMinMax: [
            ...newDataSets.eloMinMax,
            ...getNewMinMax(newObject.eloBoxPlot),
          ],
          movesMinMax: [
            ...newDataSets.movesMinMax,
            ...getNewMinMax(newObject.movesBoxPlot),
          ],
          [key]: {
            ...sets,
            ...newObject,
          },
        }
      })
      setDataSets(getRange(newDataSets))
    }

    if (
      dataSets &&
      prevCheckedObject &&
      !_.isEqual(checkedObject, prevCheckedObject)
    ) {
      const changedValues = dataKeys.filter(
        key => checkedObject[key] !== prevCheckedObject[key]
      )
      const filteredDataKeys = dataKeys.filter(d => !changedValues.includes(d))
      let newDataSets = {
        movesMinMax: [
          ...filteredDataKeys
            .map(key => [
              dataSets[key].eloBoxPlot.r0,
              dataSets[key].eloBoxPlot.r1,
            ])
            .flat(),
        ],
        eloMinMax: [
          ...filteredDataKeys
            .map(key => [
              dataSets[key].movesBoxPlot.r0,
              dataSets[key].movesBoxPlot.r1,
            ])
            .flat(),
        ],
        ...dataSets,
      }

      changedValues.forEach(val => {
        const isChecked = checkedObject[val]
        const sets = dataSets[val]
        const newObject = getNewDatasets(sets.unfiltered, !isChecked)
        newDataSets = {
          ...newDataSets,
          eloMinMax: [
            ...newDataSets.eloMinMax,
            ...getNewMinMax(newObject.eloBoxPlot),
          ],
          movesMinMax: [
            ...newDataSets.movesMinMax,
            ...getNewMinMax(newObject.movesBoxPlot),
          ],
          [val]: {
            ...sets,
            periodFiltered: isChecked
              ? getPeriodFilteredData(sets.unfiltered, period)
              : sets.unfiltered,
            ...newObject,
          },
        }
      })
      setDataSets(getRange(newDataSets))
    }
  }, [
    checkedObject,
    dataKeys,
    dataSets,
    period,
    prevCheckedObject,
    prevPeriod,
    prevResultCheckedObject,
    resultCheckedObject,
  ])

  const infoContainerRefs = useArrayRefs(data.length)
  const barContainerRefs = useArrayRefs(data.length)
  const [hoveredElementTop, setHoveredElementTop] = useState(undefined)
  const [hoveredElementBottom, setHoveredElementBottom] = useState(undefined)
  const [shouldTooltipClose, setShouldTooltipClose] = useState(false)

  const [sumMetrics, setSumMetrics] = useState(undefined)
  useEffect(() => {
    function getSumMetrics() {
      let initSumMetrics = {}
      dataKeys.forEach(d => {
        const dataset = dataSets[d].periodResultFiltered
        initSumMetrics = {
          ...initSumMetrics,
          [d]: {
            noOfGames: dataset.length,
            avgElo: +_.meanBy(dataset, "player_elo").toFixed(0),
            maxElo: +max(dataset, d => d.player_elo),
          },
        }
      })
      return initSumMetrics
    }
    if (!sumMetrics && dataKeys && dataSets) {
      setSumMetrics(getSumMetrics())
    }
    if (
      sumMetrics &&
      !_.isEqual(
        dataKeys.map(d => prevDataSets[d].periodResultFiltered.length),
        dataKeys.map(d => dataSets[d].periodResultFiltered.length)
      )
    ) {
      setSumMetrics(getSumMetrics())
    }
  }, [sumMetrics, dataKeys, dataSets, prevDataSets])

  const { shouldModalToggle, setShouldModalToggle } = useModalToggle()

  return (
    <FlexContainer fullScreen color="grayDarkest">
      <GridContainer
        width="95%"
        maxWidth="1440px"
        minWidth="1100px"
        height="95%"
        maxHeight="720px"
        minHeight="600px"
        columns="200px 1fr"
        position="relative"
      >
        <ModalContainer shouldToggle={shouldModalToggle}>
          <GridContainer
            paddingTop={2}
            paddingLeft={3}
            paddingRight={3}
            paddingBottom={2}
            columnGap={3}
            rowGap={3}
            rows="repeat(2, 1fr)"
            columns="repeat(4, 1fr)"
            areas='"datasource boxplot boxplot boxplot"
                  "datasource interact interact credit"'
            fullSize
          >
            <GridContainer gridArea="datasource" rows="min-content 1fr">
              <Title fontSize={2} fontWeight={3}>
                About the data
              </Title>
              <FlexContainer
                align="flex-start"
                justify="flex-start"
                direction="column"
              >
                <FlexContainer
                  align="flex-start"
                  justify="flex-start"
                  paddingTop={3}
                  fontSize={1}
                >
                  <div>
                    The{" "}
                    <LinkAnchor href="https://www.kaggle.com/liury123/chess-game-from-12-top-players">
                      base dataset
                    </LinkAnchor>{" "}
                    for this dashboard was collected by{" "}
                    <LinkAnchor href="https://www.kaggle.com/liury123">
                      Liu Renyu
                    </LinkAnchor>{" "}
                    on the games played by 12 great chess masters in history,
                    hosted in{" "}
                    <LinkAnchor href="https://www.chess.com/">
                      chess.com
                    </LinkAnchor>
                    's database.
                  </div>
                </FlexContainer>

                <FlexContainer
                  align="flex-start"
                  justify="flex-start"
                  paddingTop={3}
                >
                  <div>
                    The idea behind this dashboard was to analyse and compare
                    the their game style, results, and evolution of different
                    grandmasters across in different phases of their career. ...
                  </div>
                </FlexContainer>
              </FlexContainer>
            </GridContainer>
            <GridContainer gridArea="boxplot" rows="min-content 1fr">
              <Title fontSize={2} fontWeight={3}>
                What are box plots and how to read them?
              </Title>
              <GridContainer columns="repeat(3, 1fr)" columnGap={3} withBorder>
                <FlexContainer
                  withBorder
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                >
                  Boxplots are a standardized way of displaying the distribution
                  of data based on a five number summary.
                  {BOX_PLOT_EXPLAIN.map(({ title, text }) => (
                    <Container paddingTop={1}>
                      <Title fontWeight={3}>{title}: </Title>
                      {text}
                    </Container>
                  ))}
                </FlexContainer>
                <FlexContainer withBorder></FlexContainer>
              </GridContainer>
            </GridContainer>
            <GridContainer gridArea="interact" rows="min-content 1fr">
              <Title fontSize={2} fontWeight={3}>
                How to interact with the dashboard?
              </Title>
            </GridContainer>
            <FlexContainer
              gridArea="credit"
              justify="flex-start"
              align="flex-end"
              paddingBottom={1}
            >
              <CreditsContainer
                justify="flex-end"
                direction="column"
                fontSize={1}
                elements={CREDIT_ELEMENTS}
                absPos={false}
              />
            </FlexContainer>
          </GridContainer>
        </ModalContainer>
        <TooltipContainer
          hoveredElement={hoveredElementTop}
          arrowLeftRight
          arrowTowardsTop
          dx={5}
          isInteractive
          shouldClose={shouldTooltipClose}
          width="325px"
          height="225px"
        >
          <CarouselContainer pages={CAROUSEL_PAGES}>
            {CAROUSEL_PAGES.map((page, i) => {
              const getIsFilteredIn = key =>
                Object.values(checkedObject).every(el => el) ||
                Object.values(checkedObject).every(el => !el) ||
                checkedObject[key]
              return (
                <FlexContainer
                  key={page}
                  paddingLeft={2}
                  paddingRight={2}
                  direction="column"
                  align="flex-start"
                  justify="flex-start"
                  width="100%"
                  height="100%"
                >
                  <Title marginTop={2} marginBottom={2} fontWeight={3}>
                    {page}
                  </Title>
                  {i === 0 && (
                    <p>
                      {mouseOverValue.current &&
                        data.find(
                          ({ nameId }) => nameId === mouseOverValue.current
                        ).bio.bio}
                    </p>
                  )}
                  {[1, 2, 3].includes(i) && (
                    <VerticalBarCircleChart
                      key={page}
                      isBar={i === 1}
                      isCircle={i !== 1}
                      data={
                        sumMetrics &&
                        dataKeys
                          .map(key => {
                            const isFilteredIn = getIsFilteredIn(key)
                            return {
                              name: key,
                              value: isFilteredIn
                                ? i === 1
                                  ? sumMetrics[key].noOfGames
                                  : i === 2
                                  ? sumMetrics[key].avgElo
                                  : sumMetrics[key].maxElo
                                : 0,
                              filteredOut: !isFilteredIn,
                            }
                          })
                          .sort((a, b) => b.value - a.value)
                      }
                      xKey="name"
                      yKey="value"
                      highlightedValue={mouseOverValue.current}
                      transitionDuration={0}
                    />
                  )}
                </FlexContainer>
              )
            })}
          </CarouselContainer>
        </TooltipContainer>
        <TooltipContainer
          hoveredElement={hoveredElementBottom}
          arrowLeftRight
          arrowTowardsBottom
          dx={5}
          dy={40}
          width="425px"
          height="100px"
        >
          {mouseOverValue.current && (
            <HorizontalStackedBarChartContainer
              isTooltip
              withNumber
              isFiltered={checkedObject[mouseOverValue.current]}
              colorRange={COLOR_RANGE}
              results={resultCheckedObject}
              data={dataSets[mouseOverValue.current]}
            />
          )}
        </TooltipContainer>
        <GridContainer rows="180px 1fr">
          <GridContainer rows="2fr 1fr" rowGap={0}>
            <FlexContainer
              justify="flex-start"
              align="flex-start"
              direction="column"
              paddingLeft={3}
            >
              <Title fontSize={5} fontWeight={0} style={{ marginTop: -5 }}>
                Checkmate
              </Title>

              <Title fontSize={1} fontWeight={4} marginTop={1}>
                15,000 games
              </Title>
              <Title fontSize={1} fontWeight={4} marginTop={2}>
                from 8 chess grandmasters
              </Title>
            </FlexContainer>
            <FlexContainer align="flex-end">
              <FlexContainer
                cursor="pointer"
                onClick={() => setShouldModalToggle(true)}
              >
                <IoIosHelpCircle size={25} fill={grayDarkest} />
              </FlexContainer>
            </FlexContainer>
          </GridContainer>
          <GridContainer rows="1fr 50px">
            <GridContainer rows="1fr 100px">
              <GridContainer rows="repeat(2, 1fr)" rowGap={0.5}>
                {SYNCED_CHECKBOXES.map(box => (
                  <FlexContainer direction="column" key={box}>
                    <FlexContainer>
                      <Title fontWeight={3} marginBottom={2}>
                        {box === "elo"
                          ? "Opponent's ELO Score"
                          : "Number of Moves"}
                      </Title>
                    </FlexContainer>
                    <CheckBox
                      parentChecked
                      checked={syncObject[box]}
                      onClick={() =>
                        setSyncObject(prev => ({ ...prev, [box]: !prev[box] }))
                      }
                    />
                    <Title>
                      {syncObject[box]
                        ? "Uniform axis range"
                        : "Independent axis range"}
                    </Title>
                  </FlexContainer>
                ))}
              </GridContainer>
              <GridContainer rows="repeat(2, 50%)" rowGap={0}>
                <FlexContainer>
                  <HorizontalMultiSelect
                    title="Game Result for Player"
                    values={["Lose", "Draw", "Win"]}
                    colorRange={COLOR_RANGE}
                    checkedObject={resultCheckedObject}
                    handleClick={val => {
                      setResultCheckedObject(prev => {
                        if (
                          Object.values(prev).filter(d => d).length === 1 &&
                          prev[val]
                        ) {
                          return {
                            ...prev,
                          }
                        }
                        return {
                          ...prev,
                          [val]: !prev[val],
                        }
                      })
                    }}
                  />
                </FlexContainer>
                <FlexContainer>
                  {checkedObject && (
                    <SelectAllText
                      handleClick={isMissing => {
                        setCheckedObject(
                          isMissing
                            ? checkUncheckAll(true, dataKeys)
                            : checkUncheckAll(false, dataKeys)
                        )
                      }}
                      array={Object.values(checkedObject)}
                    />
                  )}
                </FlexContainer>
              </GridContainer>
            </GridContainer>
            <FlexContainer>
              <Title fontWeight={3} marginBottom={2}>
                Games in the Dataset
              </Title>
            </FlexContainer>
          </GridContainer>
        </GridContainer>
        <GridContainer rows="1fr 50px">
          {checkedObject && (
            <SortableComponent
              axis="x"
              lockAxis="x"
              columnGap={3}
              fullSize
              useDragHandle
              onSortStart={() => setShouldTooltipClose(true)}
              onSortEnd={() => setShouldTooltipClose(false)}
              columns="repeat(8, 1fr)"
              items={dataKeys.map((d, i) => {
                const dataSet = data.find(({ nameId }) => nameId === d)
                const keySumMetrics = sumMetrics && sumMetrics[d]
                const isChecked = checkedObject[d]
                return (
                  <GridContainer
                    rows="180px 1fr 100px"
                    key={d}
                    fullSize
                    onMouseEnter={() => {
                      setMouseOver(d)
                      mouseOverValue.current = d
                    }}
                    onMouseLeave={() => setMouseOver(undefined)}
                  >
                    <GridContainer
                      ref={infoContainerRefs.current[i]}
                      noGap
                      fullSize
                      rows="repeat(2, 1fr)"
                      onMouseEnter={() =>
                        setHoveredElementTop(infoContainerRefs.current[i])
                      }
                      onMouseLeave={() => setHoveredElementTop(undefined)}
                    >
                      <GridContainer noGap columns="70% 30%">
                        <Container pos="relative">
                          <Image
                            style={{ maxHeight: 90, borderRadius: 2 }}
                            fluid={dataSet.image.fluid}
                          />
                        </Container>
                        <FlexContainer
                          visibility={mouseOver === d ? "visible" : "hidden"}
                        >
                          <SortableHandle
                            size={15}
                            horizontal
                            align="flex-start"
                          />
                        </FlexContainer>
                      </GridContainer>
                      <GridContainer
                        noGap
                        rows="repeat(4, 1fr)"
                        paddingLeft={1}
                        paddingRight={1}
                      >
                        {keySumMetrics && (
                          <>
                            <FlexContainer justify="flex-start" fontWeight={3}>
                              {dataSet.fullName}
                            </FlexContainer>
                            <FlexContainer justify="space-between">
                              <span>No. of games:</span>
                              <CountUpSpan value={+keySumMetrics.noOfGames} />
                            </FlexContainer>
                            <FlexContainer justify="space-between">
                              <span>Avg. ELO:</span>
                              <CountUpSpan value={+keySumMetrics.avgElo} />
                            </FlexContainer>
                            <FlexContainer justify="space-between">
                              <span>Max. ELO:</span>
                              <CountUpSpan value={+keySumMetrics.maxElo} />
                            </FlexContainer>
                          </>
                        )}
                      </GridContainer>
                    </GridContainer>
                    <ParallelBoxPlotColumn
                      data={dataSets[d]}
                      syncObject={syncObject}
                      eloRange={dataSets.eloRange}
                      movesRange={dataSets.movesRange}
                      isResultsFiltered={Object.values(
                        resultCheckedObject
                      ).includes(false)}
                      isChecked={isChecked}
                    />
                    <GridContainer
                      ref={barContainerRefs.current[i]}
                      rows="repeat(2, 50%)"
                      rowGap={0}
                    >
                      <FlexContainer
                        direction="column"
                        onMouseEnter={() =>
                          setHoveredElementBottom(barContainerRefs.current[i])
                        }
                        onMouseLeave={() => setHoveredElementBottom(undefined)}
                      >
                        <HorizontalStackedBarChartContainer
                          isFiltered={isChecked}
                          colorRange={COLOR_RANGE}
                          results={resultCheckedObject}
                          data={dataSets[d]}
                        />
                      </FlexContainer>
                      <FlexContainer>
                        <CheckBox
                          parentChecked
                          checked={isChecked}
                          value={d}
                          onClick={() => {
                            setCheckedObject(prev => ({
                              ...prev,
                              [d]: !prev[d],
                            }))
                          }}
                        />
                      </FlexContainer>
                    </GridContainer>
                  </GridContainer>
                )
              })}
            />
          )}
          <FlexContainer pos="relative">
            <Range
              min={0}
              max={4}
              step={1}
              allowCross={false}
              marks={{
                1: <Title>Early</Title>,
                2: <Title>Mid</Title>,
                3: <Title>Late</Title>,
              }}
              defaultValue={period}
              onChange={newPeriod => {
                if (newPeriod[0] !== newPeriod[1]) setPeriod(newPeriod)
              }}
              trackStyle={[{ backgroundColor: grayDarkest, height: 1 }]}
              railStyle={{ backgroundColor: grayLightest, height: 1 }}
              handleStyle={[
                {
                  backgroundColor: grayLightest,
                  top: 5,
                  border: `solid 1px ${grayDarkest}`,
                  width: 10,
                  height: 10,
                },
                {
                  backgroundColor: grayLightest,
                  top: 5,
                  border: `solid 1px ${grayDarkest}`,
                  width: 10,
                  height: 10,
                },
              ]}
              activeDotStyle={{
                backgroundColor: grayDarkest,
                border: `solid 1px ${grayDarkest}`,
              }}
              dotStyle={{
                backgroundColor: grayLightest,
                marginBottom: 1,
                border: `solid 1px ${grayLightest}`,
              }}
            />
          </FlexContainer>
        </GridContainer>
      </GridContainer>
    </FlexContainer>
  )
}
