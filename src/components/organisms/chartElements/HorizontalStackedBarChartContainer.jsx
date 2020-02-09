import React, { useState, useEffect } from "react"
import _ from "lodash"

import { FlexContainer, GridContainer } from "../../atoms"
import { usePrevious } from "../../../hooks"
import { HorizontalStackedBar } from "../../molecules"

function getResultsData(data) {
  const orderedList = ["Lose", "Draw", "Win"]
  const totalLength = data.length
  const groupped = _.groupBy(data, "result")
  let percentagesObject = {}
  orderedList.forEach(
    el =>
      (percentagesObject = {
        ...percentagesObject,
        [el]: groupped[el].length / totalLength,
      })
  )
  return percentagesObject
}

export default function({
  data: { unfiltered, periodFiltered },
  isFiltered,
  colorRange,
  results,
  isTooltip,
  withNumber,
}) {
  const prevIsFiltered = usePrevious(isFiltered)
  const prevPeriodFiltered = usePrevious(periodFiltered)
  const prevUnfiltered = usePrevious(unfiltered)
  const [state, setState] = useState({
    isInitialized: false,
    resultData: {
      unfilteredResults: undefined,
      filteredResults: undefined,
    },
  })

  const { isInitialized, resultData } = state

  useEffect(() => {
    if (!isInitialized && unfiltered) {
      const resultData = getResultsData(unfiltered)
      setState({
        isInitialized: true,
        resultData: {
          unfilteredResults: resultData,
          filteredResults: resultData,
        },
      })
    }

    if (isInitialized) {
      if (prevIsFiltered && !isFiltered) {
        setState(prev => ({
          ...prev,
          resultData: {
            ...prev.resultData,
            filteredResults: prev.resultData.unfilteredResults,
          },
        }))
      }
      if (periodFiltered.length !== prevPeriodFiltered.length) {
        setState(prev => ({
          ...prev,
          resultData: {
            ...prev.resultData,
            filteredResults: getResultsData(periodFiltered),
          },
        }))
      }
      if (unfiltered.length !== prevUnfiltered.length) {
        setState(prev => ({
          ...prev,
          resultData: {
            ...prev.resultData,
            unfilteredResults: getResultsData(unfiltered),
          },
        }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFiltered, isInitialized, periodFiltered, prevIsFiltered, unfiltered])

  const isFilterActive = unfiltered.length !== periodFiltered.length

  return (
    <GridContainer
      columnGap={0}
      rows="repeat(2, 1fr)"
      rowGap={isTooltip ? 1 : 0}
      columns={(isTooltip && isFilterActive) ? "60px 1fr" : "1fr"}
      height="100%"
      width="100%"
    >
      {Object.keys(resultData).map((obj, i) => {
        const isFirst = i === 1
        return (
          <>
            {isTooltip && isFilterActive && (
              <FlexContainer
                justify="flex-start"
                paddingLeft={2}
                paddingBottom={isFirst && 2}
                paddingTop={!isFirst && 2}
              >
                {isFirst ? "Unfiltered" : "Filtered"}
              </FlexContainer>
            )}
            <FlexContainer key={obj} height="100%" width="100%">
              <HorizontalStackedBar
                withNumber={withNumber}
                data={resultData[obj]}
                margin={{
                  top: !isFirst ? 10 : 0,
                  left: 10,
                  bottom: isFirst ? 10 : 0,
                  right: 10,
                }}
                colorRange={colorRange}
                highlightArray={
                  isFiltered
                    ? Object.keys(results).filter(d => results[d])
                    : Object.keys(results)
                }
              />
            </FlexContainer>
          </>
        )
      })}
    </GridContainer>
  )
}
