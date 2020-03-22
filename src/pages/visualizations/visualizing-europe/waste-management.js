import React from "react"
import _ from "lodash"
import { Helmet } from "react-helmet"

import WASTE_MANAGEMENT_CONSTANTS from "../../../constants/visualizing-europe/wasteManagement"
import {
  useFetchData,
  useUniqValuesList,
  useGrouppedData,
} from "../../../hooks"
import WasteManagemetDashboard from "../../../components/templates/visualizing-europe/WasteManagement"
const { DATA_URL } = WASTE_MANAGEMENT_CONSTANTS

export default function Dashboard() {
  const { isLoading, response } = useFetchData(DATA_URL)

  const countryList = useUniqValuesList(response, "country", ["EU 28"])
  const grouppedData = useGrouppedData(response, "country")

  return (
    <>
      <Helmet title="Waste Management in Europe" />
      <WasteManagemetDashboard
        countryList={countryList}
        data={grouppedData}
        loading={isLoading}
      />
    </>
  )
}
