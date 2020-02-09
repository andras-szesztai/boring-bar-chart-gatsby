import React, { useState, useEffect, useRef } from "react"
import _ from "lodash"

import { GridContainer, FlexContainer } from "../../atoms"
import { VerticalBoxPlot, TooltipContainer } from "../../molecules"
import { usePrevious, useArrayRefs } from "../../../hooks"
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

  const topContainerRef = useRef()
  const bottomContainerRef = useRef()
  const [hoveredElement, setHoveredElement] = useState({
    element: undefined,
    pos: undefined,
  })

  const [elHeight, setElHeight] = useState(0)

  useEffect(() => {
    if (!elHeight && bottomContainerRef && bottomContainerRef.current) {
      setElHeight(bottomContainerRef.current.clientHeight)
    }
  }, [elHeight])

  return (
    <GridContainer rows="repeat(2, 1fr)" rowGap={1.5}>
      <TooltipContainer
        hoveredElement={hoveredElement.element}
        arrowLeftRight
        arrowTowardsTop={hoveredElement.pos === "top"}
        arrowTowardsBottom={hoveredElement.pos === "bottom"}
        dy={hoveredElement.pos === "bottom" ? elHeight * 0.8 : elHeight * 0.2}
        dx={5}
        width="250px"
        height="325px"
      >
        Hello World
      </TooltipContainer>
      <GridContainer
        columnGap={0.5}
        columns="repeat(2, 1fr)"
        ref={topContainerRef}
        onMouseEnter={() =>
          setHoveredElement({ element: topContainerRef, pos: "top" })
        }
        onMouseLeave={() =>
          setHoveredElement({ element: undefined, pos: "top" })
        }
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
              (!_.isEqual(unfilteredEloBoxPlot, eloBoxPlot) ||
                isResultsFiltered)
            }
          />
        </FlexContainer>
      </GridContainer>
      <GridContainer
        columnGap={0.5}
        columns="repeat(2, 1fr)"
        ref={bottomContainerRef}
        onMouseEnter={() =>
          setHoveredElement({ element: bottomContainerRef, pos: "bottom" })
        }
        onMouseLeave={() =>
          setHoveredElement({ element: undefined, pos: "bottom" })
        }
      >
        <FlexContainer>
          <VerticalBoxPlot
            domain={domains.moves}
            data={unfilteredMovesBoxPlot}
          />
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
    </GridContainer>
  )
}
