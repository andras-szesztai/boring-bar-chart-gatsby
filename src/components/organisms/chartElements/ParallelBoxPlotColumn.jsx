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
  eloRange,
  movesRange,
  syncObject,
  isResultsFiltered,
  isChecked,
}) {
  const eloDomain = extent([
    eloBoxPlot.r0,
    eloBoxPlot.r1,
    unfilteredEloBoxPlot.r1,
    unfilteredEloBoxPlot.r0,
  ])
  const movesDomain = extent([
    movesBoxPlot.r0,
    movesBoxPlot.r1,
    unfilteredMovesBoxPlot.r1,
    unfilteredMovesBoxPlot.r0,
  ])

  const prevEloBoxPlot = usePrevious(eloBoxPlot)
  const prevEloRange = usePrevious(eloRange)
  const prevMovesBoxPlot = usePrevious(movesBoxPlot)
  const prevMovesRange = usePrevious(movesRange)
  const [domains, setDomains] = useState({
    synced: {
      elo: eloRange,
      moves: movesRange,
    },
    unSynced: {
      elo: eloDomain,
      moves: movesDomain,
    },
  })

  console.log(eloRange)

  useEffect(() => {
    if (
      (prevEloBoxPlot && !_.isEqual(eloBoxPlot, prevEloBoxPlot)) ||
      !_.isEqual(movesBoxPlot, prevMovesBoxPlot) ||
      !_.isEqual(eloRange, prevEloRange) ||
      !_.isEqual(movesRange, prevMovesRange)
    ) {
      setDomains({
        synced: {
          elo: eloRange,
          moves: movesRange,
        },
        unSynced: {
          elo: eloDomain,
          moves: movesDomain,
        },
      })
    }
  }, [
    eloBoxPlot,
    eloDomain,
    eloRange,
    movesBoxPlot,
    movesDomain,
    movesRange,
    prevEloBoxPlot,
    prevEloRange,
    prevMovesBoxPlot,
    prevMovesRange,
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

  const isTop = hoveredElement.pos === "top"
  return (
    <GridContainer rows="repeat(2, 1fr)" rowGap={1.5}>
      <TooltipContainer
        hoveredElement={hoveredElement.element}
        arrowLeftRight
        arrowTowardsTop={isTop}
        arrowTowardsBottom={hoveredElement.pos === "bottom"}
        dy={hoveredElement.pos === "bottom" ? elHeight * 0.8 : elHeight * 0.2}
        dx={5}
        width="250px"
        height="325px"
      >
        <GridContainer
          columnGap={0.5}
          columns="repeat(2, 1fr)"
          width="100%"
          height="100%"
        >
          <FlexContainer>
            <VerticalBoxPlot
              domain={isTop ? domains.unSynced.elo : domains.unSynced.moves}
              data={isTop ? unfilteredEloBoxPlot : unfilteredMovesBoxPlot}
            />
          </FlexContainer>
          <FlexContainer>
            <VerticalBoxPlot
              domain={isTop ? domains.unSynced.elo : domains.unSynced.moves}
              data={isTop ? eloBoxPlot : movesBoxPlot}
              isFiltered={
                isChecked &&
                (!_.isEqual(unfilteredEloBoxPlot, eloBoxPlot) ||
                  isResultsFiltered)
              }
            />
          </FlexContainer>
        </GridContainer>
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
          <VerticalBoxPlot
            domain={syncObject.elo ? domains.synced.elo : domains.unSynced.elo}
            data={unfilteredEloBoxPlot}
          />
        </FlexContainer>
        <FlexContainer>
          <VerticalBoxPlot
            domain={syncObject.elo ? domains.synced.elo : domains.unSynced.elo}
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
            domain={
              syncObject.moves ? domains.synced.moves : domains.unSynced.moves
            }
            data={unfilteredMovesBoxPlot}
          />
        </FlexContainer>
        <FlexContainer>
          <VerticalBoxPlot
            domain={
              syncObject.moves ? domains.synced.moves : domains.unSynced.moves
            }
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
