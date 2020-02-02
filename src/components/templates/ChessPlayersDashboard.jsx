import React, { useState, useEffect, useRef } from "react"
import Image from "gatsby-image"
import Range from "rc-slider/lib/Range"
import _ from "lodash"
import "rc-slider/assets/index.css"

import {
  FlexContainer,
  GridContainer,
  CheckBox,
  SelectAllText,
  SortableHandle,
  Title,
} from "../atoms"
import {
  SortableComponent,
  CountUpSpan,
  HorizontalMultiSelect,
} from "../molecules"
import {
  ParallelBoxPlotColumn,
  HorizontalStackedBarChartContainer,
} from "../organisms"
import { colors } from "../../themes/theme"
import { Container } from "../atoms/containers"
import { usePrevious, useArrayRefs } from "../../hooks"
import { max, quantile, extent } from "d3-array"
import TooltipContainer from "../molecules/containers/TooltipContainer"

const { grayLightest, grayDarkest, grayDark } = colors

const COLOR_RANGE = ["#fc5050", "#ffd00c", "#415f77"]
const SYNCED_CHECKBOXES = ["elo", "moves"]

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
      >
        <TooltipContainer
          hoveredElement={hoveredElementTop}
          arrowLeftRight
          arrowTowardsTop
          dx={5}
          isInteractive
        >
          {mouseOver}
        </TooltipContainer>
        <TooltipContainer
          hoveredElement={hoveredElementBottom}
          arrowLeftRight
          arrowTowardsBottom
          dx={5}
          dy={40}
        >
          {mouseOver}
        </TooltipContainer>
        <GridContainer rows="180px 1fr">
          <FlexContainer>Title</FlexContainer>
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
              <Title fontWeight={3}>Games in the Dataset</Title>
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
              columns="repeat(8, 1fr)"
              items={dataKeys.map((d, i) => {
                const dataSet = data.find(({ nameId }) => nameId === d)
                const filteredSet = dataSets[d].periodResultFiltered
                const isChecked = checkedObject[d]
                return (
                  <GridContainer
                    rows="180px 1fr 100px"
                    key={d}
                    fullSize
                    onMouseEnter={() => setMouseOver(d)}
                    onMouseLeave={() => setMouseOver(undefined)}
                  >
                    <GridContainer
                      ref={infoContainerRefs.current[i]}
                      noGap
                      fullSize
                      rows="repeat(2, 1fr)"
                      onMouseEnter={() =>
                        setHoveredElementTop(
                          infoContainerRefs.current[
                            i
                          ].current.getBoundingClientRect()
                        )
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
                        <FlexContainer justify="flex-start" fontWeight={3} >
                          {dataSet.fullName}
                        </FlexContainer>
                        <FlexContainer justify="space-between">
                          <span>No. of games:</span>
                          <CountUpSpan
                            value={+filteredSet.length}
                          />
                        </FlexContainer>
                        <FlexContainer justify="space-between">
                          <span>Avg. ELO:</span>
                          <CountUpSpan
                            value={
                              +_.meanBy(filteredSet, "player_elo").toFixed(0)
                            }
                          />
                        </FlexContainer>
                        <FlexContainer justify="space-between">
                          <span>Max. ELO:</span>
                          <CountUpSpan
                            value={+max(filteredSet, d => d.player_elo)}
                          />
                        </FlexContainer>
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
                    />
                    <GridContainer
                      ref={barContainerRefs.current[i]}
                      rows="repeat(2, 50%)"
                      rowGap={0}
                      onMouseEnter={() =>
                        setHoveredElementBottom(
                          barContainerRefs.current[
                            i
                          ].current.getBoundingClientRect()
                        )
                      }
                      onMouseLeave={() => setHoveredElementBottom(undefined)}
                    >
                      <FlexContainer direction="column">
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
              trackStyle={[{ backgroundColor: grayDarkest }]}
              handleStyle={[
                { backgroundColor: grayDark },
                { backgroundColor: grayDark },
              ]}
              railStyle={{ backgroundColor: grayLightest }}
              activeDotStyle={{ backgroundColor: grayDarkest }}
              // dotStyle={{ backgroundColor: grayDarkest }}
            />
          </FlexContainer>
        </GridContainer>
      </GridContainer>
    </FlexContainer>
  )
}
