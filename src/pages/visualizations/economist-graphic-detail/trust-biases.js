import React from "react"

import { TrustBiases } from "../../../components/templates/economist-graphic-detail"
import { useFetchData } from "../../../hooks"
import { DATASET_URL } from "../../../constants/trustBiases"
import { SiteHelmet } from "../../../components/molecules"

export default function() {
  const { response } = useFetchData(DATASET_URL)
  return (
    <>
      <SiteHelmet pageTitle="Trust Biases Between European Nations" />
      <TrustBiases data={response} />
    </>
  )
}
