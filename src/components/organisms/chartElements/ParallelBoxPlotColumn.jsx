import React, { useState, useEffect } from "react"
import _ from "lodash"

import { GridContainer, FlexContainer } from "../../atoms"
import { VerticalBoxPlot } from "../../molecules"
import { usePrevious } from "../../../hooks"
import { extent } from "d3-array"

export function getPeriodFilteredData(data, period) {
  const q = data.length / 4
  const startIndex = period[0] * q
  const endIndex = period[1] * q

  const periodFilteredData = _.slice(data, startIndex, endIndex)
  return periodFilteredData
}

export default function ParellelBoxPlotColumn({
  data: {
    eloBoxPlot,
    unfilteredEloBoxPlot,
    movesBoxPlot,
    unfilteredMovesBoxPlot,
  },
  data,
  eloRange,
  movesRange,
  syncObject,
}) {
  const prevSyncObject = usePrevious(syncObject)
  const [ranges, setRanges] = useState({
    elo: undefined,
    moves: undefined,
  })

  useEffect(() => {
    if (ranges && !ranges.elo && syncObject && !!syncObject.elo) {
      setRanges({
        elo: eloRange,
        moves: movesRange,
      })
    }
    if (ranges && !!ranges.elo && !_.isEqual(syncObject, prevSyncObject)) {
      setRanges({
        elo: syncObject.elo
          ? eloRange
          : extent([
              eloBoxPlot.r0,
              eloBoxPlot.r1,
              unfilteredEloBoxPlot.r1,
              unfilteredEloBoxPlot.r0,
            ]),
        moves: syncObject.moves
          ? movesRange
          : extent([
              movesBoxPlot.r0,
              movesBoxPlot.r1,
              unfilteredMovesBoxPlot.r1,
              unfilteredMovesBoxPlot.r0,
            ]),
      })
    }
  }, [
    syncObject,
    ranges,
    eloRange,
    movesRange,
    prevSyncObject,
    data,
    movesBoxPlot,
    unfilteredEloBoxPlot,
    eloBoxPlot,
    unfilteredMovesBoxPlot,
  ])

  console.log(ranges)

  return (
    <GridContainer
      rows="repeat(2, 1fr)"
      columns="repeat(2, 1fr)"
      rowGap={0.5}
      columnGap={0.5}
    >
      <FlexContainer borderColor="gray">
        <VerticalBoxPlot />
      </FlexContainer>
      <FlexContainer borderColor="gray">
        <VerticalBoxPlot />
      </FlexContainer>
      <FlexContainer borderColor="gray">
        <VerticalBoxPlot />
      </FlexContainer>
      <FlexContainer borderColor="gray">
        <VerticalBoxPlot />
      </FlexContainer>
    </GridContainer>
  )
}
