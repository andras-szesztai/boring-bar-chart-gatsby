import React, { useEffect, useState } from "react"
import axios from "axios"

import {
  DATA_URL_HU,
  DATA_URL_EN,
} from "../../constants/visualizations/coronavirusHungary"
import { useFetchData } from "../../hooks"
import { CoronaVirusHungaryDashboard } from "../../components/templates/"

export default function() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    hun: undefined,
    eng: undefined,
  })

  useEffect(() => {
    setLoading(true)
    axios
      .all([axios.get(`${DATA_URL_HU}`), axios.get(`${DATA_URL_EN}`)])
      .then(
        axios.spread((hun, eng) => {
          setLoading(false)
          setData({ hun: hun.data, eng: eng.data })
        })
      )
      .catch(function(error) {
        console.log(error)
      })
  }, [])

  console.log(data)
  return (
    <>
      <CoronaVirusHungaryDashboard
        loading={loading}
        data={data.hun}
        enData={data.eng}
      />
    </>
  )
}
