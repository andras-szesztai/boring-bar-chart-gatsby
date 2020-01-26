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

function getBoxPlotData({ minMax, sorted }) {
  const min = sorted[0]
  const max = sorted[sorted.length - 1]
  const q1 = quantile(sorted, 0.25)
  const median = quantile(sorted, 0.5)
  const q3 = quantile(sorted, 0.75)
  const iqr = q3 - q1
  const r0 = Math.max(minMax[0], q1 - iqr * 1.5)
  const r1 = Math.min(minMax[1], q3 + iqr * 1.5)
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
  data: { eloMinMax, eloSorted, movesMinMax, movesSorted },
  data,
  isFiltered,
}) {
  const prevIsFiltered = usePrevious(isFiltered)
  const prevEloSorted= usePrevious(eloSorted)
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
    if (!isInitialized && eloSorted) {
      const eloData = getBoxPlotData({
        sorted: eloSorted,
        minMax: eloMinMax
      })
      const movesData = getBoxPlotData({
        sorted: movesSorted,
        minMax: movesMinMax
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

      if (eloSorted.length !== prevEloSorted.length) {
        setState(prev => ({
          ...prev,
          boxPlotData: {
            ...prev.boxPlotData,
            filteredOppElo: getBoxPlotData({
              sorted: eloSorted,
              minMax: eloMinMax
            }),
            filteredMoves: getBoxPlotData({
              sorted: movesSorted,
              minMax: movesMinMax
            }),
          },
        }))
      }
    }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eloMinMax, eloSorted, prevEloSorted, isFiltered, isInitialized, movesMinMax, movesSorted, prevIsFiltered])
  
  // console.log(boxPlotData)
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
