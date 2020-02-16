import React, { useState, useEffect, useRef } from "react"
import _ from "lodash"

import { GridContainer, FlexContainer, Title } from "../../atoms"
import { VerticalBoxPlot, TooltipContainer } from "../../molecules"
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
    element: topContainerRef,
    pos: "top",
  })

  const [isInitialized, setIsInitialized] = useState(false)
  useEffect(() => {
    if (!isInitialized) {
      setTimeout(() =>{
        setHoveredElement({
          element: undefined,
          pos: undefined,
        })
        setIsInitialized(true)
      }, 100)
    }
  }, [isInitialized])

  const [elHeight, setElHeight] = useState(0)

  useEffect(() => {
    if (!elHeight && bottomContainerRef && bottomContainerRef.current) {
      setElHeight(bottomContainerRef.current.clientHeight)
    }
  }, [elHeight])

  const tooltipMargin = {
    top: 10,
    right: 30,
    bottom: 10,
    left: 30,
  }

  const isTop = hoveredElement.pos === "top"
  const isFilterActive = !_.isEqual(eloBoxPlot, unfilteredEloBoxPlot)

  return (
    <GridContainer rows="repeat(2, 1fr)" rowGap={1.5}>
      <TooltipContainer
        hoveredElement={hoveredElement.element}
        arrowLeftRight
        arrowTowardsTop={isTop}
        arrowTowardsBottom={hoveredElement.pos === "bottom"}
        dy={hoveredElement.pos === "bottom" ? elHeight * 0.6 : elHeight * 0.4}
        dx={5}
        width="250px"
        height="355px"
      >
        <GridContainer
          columnGap={0.5}
          rowGap={0.5}
          paddingLeft={2}
          paddingRight={2}
          rows={
            isFilterActive ? "min-content 1fr min-content" : "min-content 1fr"
          }
          columns="repeat(2, 1fr)"
          width="100%"
          height="100%"
        >
          <Title marginTop={2} marginBottom={1} fontWeight={3}>
            {isTop ? "Opponent's ELO Score" : "Number of Moves"}
          </Title>
          <div />
          <FlexContainer>
            <VerticalBoxPlot
              domain={isTop ? domains.unSynced.elo : domains.unSynced.moves}
              data={isTop ? unfilteredEloBoxPlot : unfilteredMovesBoxPlot}
              margin={tooltipMargin}
              withText
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
              margin={tooltipMargin}
              withText
            />
          </FlexContainer>
          {isFilterActive &&
            ["Unfiltered", "Filtered"].map(el => (
              <FlexContainer paddingBottom={2}>{el}</FlexContainer>
            ))}
        </GridContainer>
      </TooltipContainer>
      <GridContainer
        columnGap={0}
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
        columnGap={0}
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
