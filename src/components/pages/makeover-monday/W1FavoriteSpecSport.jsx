import React, { useEffect, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import _ from "lodash"

import { useRawData } from "../../../hooks"
import { FavoriteSpecSportChart } from "../../templates"
import {FlexContainer} from "../../atoms"

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
        array: _.uniq(rawData.sort((a,b) => b.perc - a.perc).map(d => d.Sport)),
        grouppedData: _.groupBy(rawData, "Sport"),
      })
    }
  }, [dataObject, rawData])

  return (
    <FlexContainer fullScreen>
      {dataObject && (
        <FavoriteSpecSportChart
          rawData={rawData}
          data={dataObject.grouppedData}
          valueArray={dataObject.array}
        />
      )}
    </FlexContainer>
  )
}
