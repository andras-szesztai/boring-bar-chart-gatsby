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
  isResultsFiltered,
  isChecked,
}) {
  const prevSyncObject = usePrevious(syncObject)
  const [domains, setDomains] = useState({
    elo: undefined,
    moves: undefined,
  })

  useEffect(() => {
    if (domains && !domains.elo && syncObject && !!syncObject.elo) {
      setDomains({
        elo: eloRange,
        moves: movesRange,
      })
    }
    if (domains && !!domains.elo && !_.isEqual(syncObject, prevSyncObject)) {
      setDomains({
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
    domains,
    eloRange,
    movesRange,
    prevSyncObject,
    data,
    movesBoxPlot,
    unfilteredEloBoxPlot,
    eloBoxPlot,
    unfilteredMovesBoxPlot,
  ])

  return (
    <GridContainer
      rows="repeat(2, 1fr)"
      columns="repeat(2, 1fr)"
      rowGap={1.5}
      columnGap={0.5}
    >
      <FlexContainer>
        <VerticalBoxPlot domain={domains.elo} data={unfilteredEloBoxPlot} />
      </FlexContainer>
      <FlexContainer>
        <VerticalBoxPlot
          domain={domains.elo}
          data={eloBoxPlot}
          isFiltered={
            isChecked &&
            (!_.isEqual(unfilteredEloBoxPlot, eloBoxPlot) || isResultsFiltered)
          }
        />
      </FlexContainer>
      <FlexContainer>
        <VerticalBoxPlot domain={domains.moves} data={unfilteredMovesBoxPlot} />
      </FlexContainer>
      <FlexContainer>
        <VerticalBoxPlot
          domain={domains.moves}
          data={movesBoxPlot}
          isFiltered={
            isChecked &&
            (!_.isEqual(unfilteredMovesBoxPlot, movesBoxPlot) ||
              isResultsFiltered)
          }
        />
      </FlexContainer>
    </GridContainer>
  )
}
