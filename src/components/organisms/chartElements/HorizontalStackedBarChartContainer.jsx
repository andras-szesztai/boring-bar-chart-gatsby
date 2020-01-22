import React, { useState, useEffect } from "react"
import _ from "lodash"

import { FlexContainer } from "../../atoms"
import { usePrevious, useInitValues } from "../../../hooks"
import { HorizontalStackedBar } from "../../molecules"

export function getPeriodFilteredData(data, period){
  const q = data.length/4
  const startIndex = period[0] * q
  const endIndex = period[1] * q
  
  const periodFilteredData = _.slice(data, startIndex, endIndex)
  return periodFilteredData
}

function getResultsData({ data, isFiltered, period }) {
  let dataSet = data
  if (isFiltered) {
    dataSet = getPeriodFilteredData(data, period)
  }
  const orderedList = ["Lose", "Draw", "Win"]
  const totalLength = dataSet.length
  const groupped = _.groupBy(dataSet, "result")
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

export default function({ data, period, isFiltered, colorRange}) {
  const prevIsFiltered = usePrevious(isFiltered)
  const prevPeriod = usePrevious(period)
  const initValues = useInitValues({ period })
  const [state, setState] = useState({
    isInitialized: false,
    resultData: {
      unfilteredResults: undefined,
      filteredResults: undefined,
    },
  })

  

  const { isInitialized, resultData } = state
  
  useEffect(() => {
    if (!isInitialized && data) {
      const resultData = getResultsData({
        data,
        period,
      })
      setState({
        isInitialized: true,
        resultData: {
          unfilteredResults: resultData,
          filteredResults: resultData,
        },
      })
    }

    if (isInitialized) {
      const { period: initPeriod } = initValues.current
      if (prevIsFiltered && !isFiltered) {
        setState(prev => ({
          ...prev,
          resultData: {
            ...prev.resultData,
            filteredResults: prev.resultData.unfilteredResults,
          },
        }))
      }

      if (
        (!prevIsFiltered && isFiltered && !_.isEqual(initPeriod, period)) ||
        !_.isEqual(period, prevPeriod)
      ) {
        setState(prev => ({
          ...prev,
          resultData: {
            ...prev.resultData,
            filteredResults: getResultsData({
              data,
              period,
              isFiltered
            }),
          },
        }))
      }
    }
  }, [
    data,
    initValues,
    isFiltered,
    isInitialized,
    period,
    prevIsFiltered,
    prevPeriod,
  ])
  
  return (
    <>
      {Object.keys(resultData).map((obj, i) => {
      const isFirst = i === 1
      return (
        <FlexContainer key={obj} height="50%" width="100%">
          <HorizontalStackedBar
            data={resultData[obj]}
            margin={{ top: isFirst ? 0 : 10, left: 10, bottom: isFirst ? 10 : 0, right: 10 }}
            colorRange={colorRange}
          />
        </FlexContainer>
      )})}
    </>
  )
}
