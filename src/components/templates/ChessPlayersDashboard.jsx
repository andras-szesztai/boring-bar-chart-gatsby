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
import { SortableComponent } from "../molecules"
import {
  ParallelBoxPlotColumn,
  HorizontalStackedBarChartContainer,
} from "../organisms"
import VerticalMultiSelect from "../molecules/controlElements/VerticalMultiSelect"
import { colors } from "../../themes/theme"
import { Container } from "../atoms/containers"
import { usePrevious } from "../../hooks"

const { grayLightest, grayDarkest, grayDark } = colors

const COLOR_RANGE = ["#fc5050", "#ffd00c", "#415f77"]

// TODO: setup functions to filter datasets on dasboard level for all columns

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

  const [dataSets, setDataSets] = useState(undefined)
  useEffect(() => {
    if (!dataSets && dataKeys) {
      let object = {}
      dataKeys.forEach(key => {
        const set = data.find(d => d.nameId === key).dataSet
        object = {
          ...object,
          [key]: {
            unfiltered: set,
            periodFiltered: set,
            periodResultFiltered: set,
          },
        }
      })
      setDataSets(object)
    }
  }, [data, dataKeys, dataSets])

  // Filtering on change
  useEffect(() => {
    if (dataSets && prevPeriod && !_.isEqual(period, prevPeriod)) {
      let newDataSets = {}
      dataKeys.forEach(key => {
        const isChecked = checkedObject[key]
        const sets = dataSets[key]
        const unfiltered = sets.unfiltered
        newDataSets = {
          ...newDataSets,
          [key]: {
            ...sets,
            periodFiltered: isChecked
              ? getPeriodFilteredData(unfiltered, period)
              : unfiltered,
            periodResultFiltered: isChecked
              ? getPeriodFilteredData(
                  getResultFilteredData(
                    unfiltered,
                    Object.keys(resultCheckedObject).filter(
                      k => resultCheckedObject[k]
                    )
                  ),
                  period
                )
              : unfiltered,
          },
        }
      })
      setDataSets(newDataSets)
    }
    if (
      dataSets &&
      prevResultCheckedObject &&
      !_.isEqual(resultCheckedObject, prevResultCheckedObject)
    ) {
      let newDataSets = {}
      dataKeys.forEach(key => {
        const isChecked = checkedObject[key]
        const sets = dataSets[key]
        const unfiltered = sets.unfiltered
        newDataSets = {
          ...newDataSets,
          [key]: {
            ...sets,
            periodResultFiltered: isChecked
              ? getPeriodFilteredData(
                  getResultFilteredData(
                    unfiltered,
                    Object.keys(resultCheckedObject).filter(
                      k => resultCheckedObject[k]
                    )
                  ),
                  period
                )
              : unfiltered,
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
      const changedValue = dataKeys.filter(
        key => checkedObject[key] !== prevCheckedObject[key]
      )
      const isChecked = checkedObject[changedValue]
      setDataSets(prev => ({
        ...prev,
        [changedValue]: {
          ...prev[changedValue],
          periodFiltered: isChecked
            ? getPeriodFilteredData(prev[changedValue].unfiltered, period)
            : prev[changedValue].unfiltered,
          periodResultFiltered: isChecked
            ? getPeriodFilteredData(
                getResultFilteredData(
                  prev[changedValue].unfiltered,
                  Object.keys(resultCheckedObject).filter(
                    k => resultCheckedObject[k]
                  )
                ),
                period
              )
            : prev[changedValue].unfiltered,
        },
      }))
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


  // TODO: pass in data to columns
  console.log(dataSets)

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
                      setResultCheckedObject(prev => ({
                        ...prev,
                        [val]: !prev[val],
                      }))
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
                const isChecked = checkedObject[d]
                return (
                  <GridContainer rows="180px 1fr 100px" key={d} fullSize>
                    <GridContainer
                      noGap
                      fullSize
                      rows="repeat(2, 1fr)"
                      withBorder
                    >
                      <GridContainer noGap columns="70% 30%" withBorder>
                        <Container pos="relative">
                          <Image
                            style={{ maxHeight: 90 }}
                            fluid={dataSet.image.fluid}
                          />
                        </Container>
                        <FlexContainer>
                          <SortableHandle horizontal align="flex-start" />
                        </FlexContainer>
                      </GridContainer>
                      <GridContainer
                        noGap
                        rows="repeat(4, 1fr)"
                        paddingLeft={1}
                      >
                        <FlexContainer justify="flex-start">
                          {dataSet.fullName}
                        </FlexContainer>
                        <FlexContainer justify="flex-start">
                          No. of games:
                        </FlexContainer>
                        <FlexContainer justify="flex-start">
                          Avg. ELO:
                        </FlexContainer>
                        <FlexContainer justify="flex-start">
                          Max. ELO:
                        </FlexContainer>
                      </GridContainer>
                    </GridContainer>
                    <ParallelBoxPlotColumn
                      data={dataSet.dataSet}
                      isFiltered={isChecked}
                      period={period}
                      results={Object.keys(resultCheckedObject).filter(
                        key => resultCheckedObject[key]
                      )}
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
                          data={dataSet.dataSet}
                          period={period}
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
              onChange={newPeriod => setPeriod(newPeriod)}
              trackStyle={[{ backgroundColor: grayDarkest }]}
              handleStyle={[
                { backgroundColor: grayDark },
                { backgroundColor: grayDark },
              ]}
              railStyle={{ backgroundColor: grayLightest }}
            />
          </FlexContainer>
        </GridContainer>
      </GridContainer>
    </FlexContainer>
  )
}
