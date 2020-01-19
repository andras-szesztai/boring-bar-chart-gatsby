import React, { useState, useEffect } from "react"
import _ from "lodash"

import { FlexContainer } from "../../atoms"
import { usePrevious, useInitValues } from "../../../hooks"
import { HorizontalStackedBar } from "../../molecules"

// TODO: add period filtering too
const getPeriodFilteredData = (data, period) => data.filter(d => true)
function getResultsData({ data, isFiltered, period }) {
  let dataSet = data
  // if (isFiltered) {
  //dataSet = getPeriodFilteredData(data, period)
  // }
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
      {Object.keys(resultData).map(obj => (
        <FlexContainer height="50%" width="100%" withBorder>
          <HorizontalStackedBar
            data={resultData[obj]}
            margin={{ top: 5, left: 10, bottom: 5, right: 10 }}
            colorRange={colorRange}
          />
        </FlexContainer>
      ))}
    </>
  )
}
