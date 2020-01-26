import React, { useState, useEffect } from "react"
import _ from "lodash"

import { FlexContainer } from "../../atoms"
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
}) {
  const prevIsFiltered = usePrevious(isFiltered)
  const prevPeriodFiltered = usePrevious(periodFiltered)
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFiltered, isInitialized, periodFiltered, prevIsFiltered, unfiltered])

  return (
    <>
      {Object.keys(resultData).map((obj, i) => {
        const isFirst = i === 1
        return (
          <FlexContainer key={obj} height="50%" width="100%">
            <HorizontalStackedBar
              data={resultData[obj]}
              margin={{
                top: isFirst ? 0 : 10,
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
        )
      })}
    </>
  )
}
