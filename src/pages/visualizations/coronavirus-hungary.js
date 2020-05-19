import React, { useEffect, useState } from "react"

import {
  DATA_URL_HU,
  DATA_URL_EN,
} from "../../constants/visualizations/coronavirusHungary"
import { useFetchData } from "../../hooks"
import { CoronaVirusHungaryDashboard } from "../../components/templates/"

export default function() {
  // const { isLoading, response } = useFetchData(DATA_URL_HU)
  // const [enLoading, setEnLoading] = useState(false)
  // const [enData, setEnData] = useState(undefined)
  
  // useEffect(() => {
  //   if (response && !enLoading) {
  //     const fetchData = async () => {
  //       setEnLoading(true)
  //       try {
  //         const res = await fetch(DATA_URL_EN)
  //         const json = await res.json()
  //         setEnLoading(false)
  //         setEnData(json)
  //       } catch (error) {
  //         console.log(error)
  //       }
  //     }
  //     fetchData()
  //   }
  // }, [response, enData, enLoading])
  
  // console.log("isLoading", isLoading, enLoading)
  // console.log("hUresponse", response)
  // console.log("eNresponse", enData)
  return (
    <>
      <div>Test</div>
      {/* <CoronaVirusHungaryDashboard
        loading={isLoading}
        data={response}
        enData={enData}
      /> */}
    </>
  )
}