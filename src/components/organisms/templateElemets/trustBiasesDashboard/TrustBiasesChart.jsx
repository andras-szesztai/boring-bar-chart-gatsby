import React from "react"
import { ChartStarter } from "../../../molecules/charts"
import { useChartRefs, useDimensions } from "../../../../hooks"

import { COUNTRY_ORDER } from "../../../../constants/trustBiases"

export default function TrustBiasesChart({ data }) {
  const refs = useChartRefs()
  const dims = useDimensions({
    ref: refs.wrapperRef,
  })

  return (
    <>
      <ChartStarter refs={refs} dims={dims} withXAxis axisBottom fontSize={0} />
    </>
  )
}
