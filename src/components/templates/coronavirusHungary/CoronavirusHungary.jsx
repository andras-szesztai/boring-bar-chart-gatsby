import React from "react"
import { FlexContainer } from "../../atoms"

import { MobileOnlyView, TabletView, BrowserView, withOrientationChange } from "react-device-detect"

function CoronaVirusHungaryDashboard({ data, loading }) {

  return (
    <>
      <BrowserView>Browser</BrowserView>
      <TabletView>Tablet</TabletView>
      <MobileOnlyView>Mobile</MobileOnlyView>
    </>
  )
}


export default withOrientationChange(CoronaVirusHungaryDashboard)
