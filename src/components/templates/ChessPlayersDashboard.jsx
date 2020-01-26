import React, { useState, useEffect } from "react"
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
} from "../atoms"
import { SortableComponent, CountUpSpan } from "../molecules"
import {
  ParallelBoxPlotColumn,
  HorizontalStackedBarChartContainer,
} from "../organisms"
import VerticalMultiSelect from "../molecules/controlElements/VerticalMultiSelect"
import { colors } from "../../themes/theme"
import { Container } from "../atoms/containers"
import { usePrevious } from "../../hooks"
import { max, quantile } from "d3-array"

const { grayLightest, grayDarkest, grayDark } = colors

const COLOR_RANGE = ["#fc5050", "#ffd00c", "#415f77"]

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

  const [resultCheckedObject, setResultCheckedObject] = useState({
    Lose: true,
    Draw: true,
    Win: true,
  })
  const prevResultCheckedObject = usePrevious(resultCheckedObject)
  const [period, setPeriod] = useState([0, 4])
  const prevPeriod = usePrevious(period)

  const sortSet = (set, sortBy) => set.map(d => d[sortBy]).sort((a, b) => a - b)

  const [dataSets, setDataSets] = useState(undefined)
  useEffect(() => {
    if (!dataSets && dataKeys) {
      let object = { movesMinMax: [], eloMinMax: [] }
      dataKeys.forEach(key => {
        const set = data.find(d => d.nameId === key).dataSet
        const eloBoxplot = getBoxPlotData(sortSet(set, "opponent_elo"))
        const movesBoxplot = getBoxPlotData(sortSet(set, "moves"))
        object = {
          ...object,
          eloMinMax: [...object.eloMinMax, eloBoxplot.r0, eloBoxplot.r1],
          movesMinMax: [
            ...object.movesMinMax,
            movesBoxplot.r0,
            movesBoxplot.r1,
          ],
          [key]: {
            unfiltered: set,
            periodFiltered: set,
            periodResultFiltered: set,
            eloBoxplot: {
              ...eloBoxplot,
            },
            movesBoxplot: {
              ...movesBoxplot,
            },
          },
        }
      })
      setDataSets(object)
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
        eloBoxplot: {
          ...getBoxPlotData(sortSet(periodResultFiltered, "opponent_elo")),
        },
        movesBoxplot: {
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
            ...getNewMinMax(newObject.eloBoxplot),
          ],
          movesMinMax: [
            ...newDataSets.movesMinMax,
            ...getNewMinMax(newObject.movesBoxplot),
          ],
          [key]: {
            ...sets,
            periodFiltered: isChecked
              ? getPeriodFilteredData(unfiltered, period)
              : unfiltered,
            ...newObject,
          },
        }
        setDataSets(newDataSets)
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
            ...getNewMinMax(newObject.eloBoxplot),
          ],
          movesMinMax: [
            ...newDataSets.movesMinMax,
            ...getNewMinMax(newObject.movesBoxplot),
          ],
          [key]: {
            ...sets,
            ...newObject,
          },
        }
      })
      setDataSets(newDataSets)
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
              dataSets[key].eloBoxplot.r0,
              dataSets[key].eloBoxplot.r1,
            ])
            .flat(),
        ],
        eloMinMax: [
          ...filteredDataKeys
            .map(key => [
              dataSets[key].movesBoxplot.r0,
              dataSets[key].movesBoxplot.r1,
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
            ...getNewMinMax(newObject.eloBoxplot),
          ],
          movesMinMax: [
            ...newDataSets.movesMinMax,
            ...getNewMinMax(newObject.movesBoxplot),
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
      setDataSets(newDataSets)
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

  return (
    <FlexContainer fullScreen>
      <GridContainer
        width="95%"
        maxWidth="1440px"
        minWidth="1100px"
        height="95%"
        maxHeight="720px"
        minHeight="600px"
        columns="200px 1fr"
      >
        <GridContainer rows="180px 1fr">
          <FlexContainer borderColor="gray">Title</FlexContainer>
          <GridContainer rows="1fr 50px">
            <GridContainer rows="1fr 100px">
              <GridContainer rows="repeat(2, 1fr)" rowGap={0.5}>
                <FlexContainer borderColor="gray" />
                <FlexContainer borderColor="gray" />
              </GridContainer>
              <GridContainer
                borderColor="gray"
                rows="repeat(2, 50%)"
                rowGap={0}
              >
                <FlexContainer>
                  <VerticalMultiSelect
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
            <FlexContainer borderColor="gray">Brush Control</FlexContainer>
          </GridContainer>
        </GridContainer>
        <GridContainer rows="1fr 50px">
          {checkedObject && (
            <SortableComponent
              axis="x"
              lockAxis="x"
              columnGap={0.5}
              fullSize
              useDragHandle
              columns="repeat(8, 1fr)"
              items={dataKeys.map(d => {
                const dataSet = data.find(({ nameId }) => nameId === d)
                const filteredSet = dataSets[d].periodResultFiltered
                const isChecked = checkedObject[d]
                return (
                  <GridContainer rows="180px 1fr 100px" key={d} fullSize>
                    <GridContainer noGap fullSize rows="repeat(2, 1fr)">
                      <GridContainer noGap columns="70% 30%">
                        <Container pos="relative">
                          <Image
                            style={{ maxHeight: 90, borderRadius: 2 }}
                            fluid={dataSet.image.fluid}
                          />
                        </Container>
                        <FlexContainer>
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
                        paddingRight={2}
                      >
                        <FlexContainer justify="flex-start">
                          {dataSet.fullName}
                        </FlexContainer>
                        <FlexContainer justify="space-between">
                          <span>No. of games:</span>
                          <CountUpSpan
                            value={+filteredSet.length}
                            fontWeight={3}
                          />
                        </FlexContainer>
                        <FlexContainer justify="space-between">
                          <span>Avg. ELO:</span>
                          <CountUpSpan
                            value={
                              +_.meanBy(filteredSet, "player_elo").toFixed(0)
                            }
                            fontWeight={3}
                          />
                        </FlexContainer>
                        <FlexContainer justify="space-between">
                          <span>Max. ELO:</span>
                          <CountUpSpan
                            fontWeight={3}
                            value={+max(filteredSet, d => d.player_elo)}
                          />
                        </FlexContainer>
                      </GridContainer>
                    </GridContainer>
                    <ParallelBoxPlotColumn
                      data={dataSets[d]}
                      isFiltered={isChecked}
                    />
                    <GridContainer
                      borderColor="gray"
                      rows="repeat(2, 50%)"
                      rowGap={0}
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
                1: <p>&#8249; Early games</p>,
                2: "Mid games",
                3: "Later games",
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
              // activeDotStyle
              // dotStyle
            />
          </FlexContainer>
        </GridContainer>
      </GridContainer>
    </FlexContainer>
  )
}
