import React, { useState, useEffect } from "react"
import { quantile } from "d3-array"
import _ from "lodash"

import { GridContainer, FlexContainer } from "../../atoms"
import { usePrevious } from "../../../hooks"

const initialDataSets = {
  q1: undefined,
  median: undefined,
  q3: undefined,
  min: undefined,
  max: undefined,
}

// TODO: add period filtering too
const getFilteredData = (data, results, period) =>
  data.filter(d => results.includes(d.result))
const getSortedValueArray = (data, key) =>
  data.map(d => d[key]).sort((a, b) => a - b)
function getBoxPlotData({ data, key, isFiltered, results, period }) {
  let dataSet = data
  if (isFiltered) {
    dataSet = getFilteredData(data, results, period)
  }
  const sortedValues = getSortedValueArray(dataSet, key)
  const min = sortedValues[0]
  const max = sortedValues[sortedValues.length - 1]
  const q1 = quantile(sortedValues, 0.25)
  const median = quantile(sortedValues, 0.5)
  const q3 = quantile(sortedValues, 0.75)
  const iqr = q3 - q1
  const r0 = Math.max(min, q1 - iqr * 1.5)
  const r1 = Math.min(max, q3 + iqr * 1.5)
  return {
    q1,
    median,
    q3,
    min,
    max,
    r0,
    r1,
  }
}

export default function ParellelBoxPlotColumn({
  data: { dataSet: data },
  isFiltered,
  results,
  period,
}) {
  const [initFilters, setInitFilters] = useState({
    results: undefined,
    period: undefined,
  })
  useEffect(() => {
    if (!initFilters.results) {
      setInitFilters({
        results,
        period,
      })
    }
  }, [initFilters.results, period, results])
  const prevIsFiltered = usePrevious(isFiltered)
  const prevResults = usePrevious(results)
  const prevPeriod = usePrevious(period)
  const [state, setState] = useState({
    isInitialized: false,
    boxPlotData: {
      unfilteredOppElo: initialDataSets,
      unfilteredMoves: initialDataSets,
      filteredOppElo: initialDataSets,
      filteredMoves: initialDataSets,
    },
  })
  const { isInitialized, boxPlotData } = state

  useEffect(() => {
    if (!isInitialized && data) {
      const eloData = getBoxPlotData({
        data,
        results,
        period,
        key: "opponent_elo",
      })
      const movesData = getBoxPlotData({
        data,
        results,
        period,
        key: "moves",
      })
      setState({
        isInitialized: true,
        boxPlotData: {
          unfilteredOppElo: eloData,
          unfilteredMoves: movesData,
          filteredOppElo: eloData,
          filteredMoves: movesData,
        },
      })
    }

    if (isInitialized) {
      // To reset when becomes unfiltered
      const { period: initPeriod, result: initResults } = initFilters
      if (prevIsFiltered && !isFiltered) {
        setState(prev => ({
          ...prev,
          boxPlotData: {
            ...prev.boxPlotData,
            filteredOppElo: prev.boxPlotData.unfilteredOppElo,
            filteredMoves: prev.boxPlotData.unfilteredMoves,
          },
        }))
      }

      if (
        (!prevIsFiltered &&
          isFiltered &&
          (!_.isEqual(initResults, results) ||
            !_.isEqual(initPeriod, period))) ||
        (!_.isEqual(results, prevResults) || !_.isEqual(period, prevPeriod))
      ) {
        setState(prev => ({
          ...prev,
          boxPlotData: {
            ...prev.boxPlotData,
            filteredOppElo: getBoxPlotData({
              data,
              results,
              isFiltered: true,
              period,
              key: "opponent_elo",
            }),
            filteredMoves: getBoxPlotData({
              data,
              isFiltered: true,
              results,
              period,
              key: "moves",
            }),
          },
        }))
      }
    }
  }, [
    data,
    initFilters,
    isFiltered,
    isInitialized,
    period,
    prevIsFiltered,
    prevPeriod,
    prevResults,
    results,
  ])

  return (
    <GridContainer
      rows="repeat(2, 1fr)"
      columns="repeat(2, 1fr)"
      rowGap={0.5}
      columnGap={0.5}
    >
      <FlexContainer borderColor="gray" />
      <FlexContainer borderColor="gray" />
      <FlexContainer borderColor="gray" />
      <FlexContainer borderColor="gray" />
    </GridContainer>
  )
}
