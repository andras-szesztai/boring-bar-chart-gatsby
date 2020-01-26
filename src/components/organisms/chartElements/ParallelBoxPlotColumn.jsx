import React, { useState, useEffect } from "react"
import { quantile } from "d3-array"
import _ from "lodash"

import { GridContainer, FlexContainer } from "../../atoms"
import { usePrevious, useInitValues } from "../../../hooks"

export function getPeriodFilteredData(data, period) {
  const q = data.length / 4
  const startIndex = period[0] * q
  const endIndex = period[1] * q

  const periodFilteredData = _.slice(data, startIndex, endIndex)
  return periodFilteredData
}

const initialDataSets = {
  q1: undefined,
  median: undefined,
  q3: undefined,
  min: undefined,
  max: undefined,
}

function getBoxPlotData({ data, key }) {
  const sortedValues = data.map(d => d[key]).sort((a, b) => a - b)
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
  data: { unfiltered, periodResultFiltered },
  isFiltered,
}) {
  const prevIsFiltered = usePrevious(isFiltered)
  const prevPeriodResultFiltered = usePrevious(periodResultFiltered)
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
    if (!isInitialized && unfiltered) {
      const eloData = getBoxPlotData({
        data: unfiltered,
        key: "opponent_elo",
      })
      const movesData = getBoxPlotData({
        data: unfiltered,
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

      if (prevPeriodResultFiltered.length !== periodResultFiltered) {
        setState(prev => ({
          ...prev,
          boxPlotData: {
            ...prev.boxPlotData,
            filteredOppElo: getBoxPlotData({
              data: periodResultFiltered,
              key: "opponent_elo",
            }),
            filteredMoves: getBoxPlotData({
              data: periodResultFiltered,
              key: "moves",
            }),
          },
        }))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isFiltered,
    isInitialized,
    periodResultFiltered,
    prevIsFiltered,
    unfiltered
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
