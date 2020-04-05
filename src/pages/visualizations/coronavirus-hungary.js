import React from "react"
import Helmet from "react-helmet"

import { DATA_URL } from "../../constants/visualizations/coronavirusHungary"
import { useFetchData } from "../../hooks"
import { CoronaVirusHungaryDashboard } from "../../components/templates/"

export default function() {
  const { isLoading, response } = useFetchData(DATA_URL)

  return (
    <>
      <Helmet title="Koronavírusban elhunytak Magyarországon" />
      <CoronaVirusHungaryDashboard loading={isLoading} data={response} />
    </>
  )
}
