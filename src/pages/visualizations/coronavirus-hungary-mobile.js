import React from "react"

import {
  DATA_URL_HU,
} from "../../constants/visualizations/coronavirusHungary"
import { useFetchData } from "../../hooks"
import { CoronaVirusHungaryMobileDashboard } from "../../components/templates/"

export default function() {
  const { isLoading, response } = useFetchData(DATA_URL_HU)

  return (
    <>
      <CoronaVirusHungaryMobileDashboard loading={isLoading} data={response}/>
    </>
  )
}
