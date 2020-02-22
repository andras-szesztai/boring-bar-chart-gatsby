import React from "react"
import { Helmet } from "react-helmet"

import { TrustBiases } from "../../../components/templates/economist-graphic-detail"
import { useFetchData } from "../../../hooks"
import { DATASET_URL } from "../../../constants/trustBiases"

export default function() {
  const rawData = useFetchData(DATASET_URL)
  console.log(rawData);
  
  return (
    <>
      <Helmet title="Trust biases* between European nations" />
      <TrustBiases data={rawData} />
    </>
  )
}
