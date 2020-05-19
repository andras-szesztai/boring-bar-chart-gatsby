import React, { useEffect, useState } from "react"
import axios from "axios"

import {
  DATA_URL_HU,
  DATA_URL_EN,
} from "../../constants/visualizations/coronavirusHungary"
import { CoronaVirusHungaryDashboard } from "../../components/templates/"

export default function() {
  const [loading, setLoading] = useState(false)
  const [dataSets, setDataSets] = useState({
    hun: undefined,
    eng: undefined,
  })

  useEffect(() => {
    setLoading(true)
    axios
      .all([axios.get(`${DATA_URL_HU}`), axios.get(`${DATA_URL_EN}`)])
      .then(
        axios.spread((hun, eng) => {
          setDataSets({ hun: hun.data, eng: eng.data })
          setLoading(false)
        })
      )
      .catch(function(error) {
        console.log(error)
      })
  }, [])

  return (
    <>
      <CoronaVirusHungaryDashboard
        loading={loading}
        data={dataSets.hun}
        enData={dataSets.eng}
      />
    </>
  )
}
