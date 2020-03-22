import React from "react"
import { Helmet } from "react-helmet"

import { TrustBiases } from "../../../components/templates/economist-graphic-detail"
import { useFetchData } from "../../../hooks"
import { DATASET_URL } from "../../../constants/trustBiases"

export default function() {
  const { response } = useFetchData(DATASET_URL)
  return (
    <>
      <Helmet title="Trust Biases Between European Nations" />
      <TrustBiases data={response} />
    </>
  )
}
