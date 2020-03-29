import React, { useState } from "react"
import { isMobileOnly, isTablet, isBrowser } from "react-device-detect"

import { FlexContainer } from "../../atoms"
import { useWindowDimensions } from "../../../hooks"
import { FullScreenLoader } from "../../molecules"
import {
  DashboardMobileView,
  DashboardTabletView,
  DashboardBrowserView,
} from "../../organisms/templateElemets/wasteManagementDashboard/views"

export default function WasteManagemetDashboard({
  data,
  loading,
  countryList,
}) {
  const [metric, setMetric] = useState("abs")
  const [selectedCountry, setSelectedCountry] = useState(undefined)
  const { windowWidth, windowHeight } = useWindowDimensions()

  const viewProps = {
    metric,
    setMetric,
    data,
    countryList,
    selectedCountry,
    setSelectedCountry,
  }

  return (
    <FlexContainer
      fullScreen={isMobileOnly}
      width={!isMobileOnly && `${windowWidth}px`}
      height={!isMobileOnly && `${windowHeight}px`}
    >
      <FullScreenLoader loading={loading} />
      {isMobileOnly && <DashboardMobileView {...viewProps} />}
      {isTablet && <DashboardTabletView {...viewProps} />}
      {isBrowser && <DashboardBrowserView {...viewProps} />}
    </FlexContainer>
  )
}
