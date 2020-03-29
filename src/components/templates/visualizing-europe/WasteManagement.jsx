import React, { useState } from "react"
import { isMobileOnly, isTablet, isBrowser } from "react-device-detect"
import _ from "lodash"

import { FlexContainer } from "../../atoms"
import { useWindowDimensions } from "../../../hooks"
import { FullScreenLoader } from "../../molecules"
import {
  DashboardMobileView,
  DashboardTabletView,
  DashboardBrowserView,
} from "../../organisms/templateElemets/visualizing-europe/wasteManagementDashboard/views"
import { COLOR_ARRAY } from "../../../constants/visualizing-europe/wasteManagement"

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

  const loaderColor = COLOR_ARRAY[_.random(-1, 3)]

  return (
    <>
      {(isTablet || isBrowser) && (
        <FlexContainer width={`${windowWidth}px`} height={`${windowHeight}px`}>
          <FullScreenLoader loading={loading} loaderColor={loaderColor} />
          {isTablet && <DashboardTabletView {...viewProps} />}
          {isBrowser && <DashboardBrowserView {...viewProps} />}
        </FlexContainer>
      )}
      {isMobileOnly && (
        <FlexContainer fullScreen>
          <FullScreenLoader
            loading={loading}
            loader="circle"
            loaderSize={80}
            loaderColor={loaderColor}
          />
          <DashboardMobileView {...viewProps} />
        </FlexContainer>
      )}
    </>
  )
}
