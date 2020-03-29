import React, { useState } from "react"
import { MobileOnlyView, TabletView, BrowserView } from "react-device-detect"
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
  const [modalIsOpen, setIsOpen] = React.useState(false)

  const viewProps = {
    metric,
    setMetric,
    data,
    countryList,
    selectedCountry,
    setSelectedCountry,
    setIsOpen,
    modalIsOpen
  }

  const loaderProps = {
    loading,
    loaderColor: COLOR_ARRAY[_.random(-1, 3)],
  }

  return (
    <>
      <MobileOnlyView>
        <FlexContainer fullScreen>
          <FullScreenLoader {...loaderProps} loader="clip" loaderSize={75} />
          <DashboardMobileView {...viewProps} />
        </FlexContainer>
      </MobileOnlyView>
      <TabletView>
        <FlexContainer width={`${windowWidth}px`} height={`${windowHeight}px`}>
          <FullScreenLoader {...loaderProps} loader="clip" loaderSize={85} />
          <DashboardTabletView {...viewProps} />
        </FlexContainer>
      </TabletView>
      <BrowserView>
        <FlexContainer fullScreen>
          <FullScreenLoader {...loaderProps} />
          <DashboardBrowserView {...viewProps} />
        </FlexContainer>
      </BrowserView>
    </>
  )
}
