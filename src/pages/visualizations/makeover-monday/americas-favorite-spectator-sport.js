import React, { useEffect, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import _ from "lodash"

import { useRawData, useFetchData } from "../../../hooks"
import { FavoriteSpecSportChart } from "../../../components/templates"
import { Helmet } from "react-helmet"

const url = "https://boring-barchart-gatsby.firebaseio.com/mm2020w1.json"

export default function Dashboard() {

  const rawData = useFetchData(url)

  const [dataObject, setDataObject] = useState({
    array: undefined,
    grouppedData: undefined,
  })
  useEffect(() => {
    if (!dataObject.array && rawData) {
      const valueArray = _.uniq(
        rawData.sort((a, b) => b.perc - a.perc).map(d => d.Sport)
      )
      const grouppedDataArray = _.groupBy(rawData, "Sport")
      const diffs = valueArray.map(el => {
        const percentages = grouppedDataArray[el]
          .sort((a, b) => b.year - a.year)
          .map(d => d.perc)
        const difference = percentages[0] - percentages[1]
        return difference
      })
      valueArray.forEach((val, i) => {
        const curr = grouppedDataArray[val]
        grouppedDataArray[val] = curr.map(c => ({ ...c, difference: diffs[i] }))
      })
      setDataObject({
        array: valueArray,
        grouppedData: grouppedDataArray,
      })
    }
  }, [dataObject, rawData])

  return (
    <>
      <Helmet title="Top Spectator Sports in the United States" />
      <FavoriteSpecSportChart
        rawData={rawData}
        data={dataObject.grouppedData}
        valueArray={dataObject.array}
      />
    </>
  )
}
