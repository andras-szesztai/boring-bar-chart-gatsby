import React, { useEffect, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { useRawData } from "../../../hooks"
import _ from "lodash"
import { FavoriteSpecSportChart } from "../../organisms"

export default function Dashboard() {
  const {
    allStrapiDatasets: { nodes },
  } = useStaticQuery(graphql`
    {
      allStrapiDatasets(filter: { name: {} }) {
        nodes {
          data {
            Sport
            perc
            year
          }
          Description
        }
      }
    }
  `)

  const rawData = useRawData(nodes)

  const [dataObject, setDataObject] = useState(undefined)
  useEffect(() => {
    if (!dataObject && rawData) {
      setDataObject({
        array:  _.uniq(rawData.map(d => d.Sport)),
        grouppedData: _.groupBy(rawData, 'Sport')
      })
    }
  }, [dataObject, rawData])

  console.log(dataObject)

  return <FavoriteSpecSportChart/>
}
