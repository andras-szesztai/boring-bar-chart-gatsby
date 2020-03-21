import React from "react"

import WASTE_MANAGEMENT_CONSTANTS from "../../../constants/visualizing-europe/wasteManagement"
import { useFetchData } from "../../../hooks"
const { DATA_URL } = WASTE_MANAGEMENT_CONSTANTS

export default function Dashboard() {
  const rawData = useFetchData(DATA_URL)

  return <div />
}
