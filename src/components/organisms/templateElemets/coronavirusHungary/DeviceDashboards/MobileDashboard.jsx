import React from "react"

import { MobileOnlyView, withOrientationChange } from "react-device-detect"
import { useOrientation } from "../../../../../hooks"

function MobileDashboard({ isLandscape, isPortrait }) {

  const orientation = useOrientation({isLandscape, isPortrait})

  return (
    <MobileOnlyView>
      {orientation === "landscape" && <div>Landscape</div>}
      {orientation === "portrait" && <div>Portrait</div>}
    </MobileOnlyView>
  )
}

export default withOrientationChange(MobileDashboard)
