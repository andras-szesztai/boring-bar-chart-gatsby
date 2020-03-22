import React from "react"
import { Helmet } from "react-helmet"

import WASTE_MANAGEMENT_CONSTANTS from "../../../constants/visualizing-europe/wasteManagement"
import { useFetchData } from "../../../hooks"
import WasteManagemetDashboard from "../../../components/templates/visualizing-europe/WasteManagement"
const { DATA_URL } = WASTE_MANAGEMENT_CONSTANTS

export default function Dashboard() {
  const { isLoading, response } = useFetchData(DATA_URL)
  return (
    <>
      <Helmet title="Waste Management in Europe" />
      <WasteManagemetDashboard data={response} loading={isLoading} />
    </>
  )
}
