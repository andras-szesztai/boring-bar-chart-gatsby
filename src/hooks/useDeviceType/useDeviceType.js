import { useState, useEffect } from "react"
import { isTablet, isMobileOnly, isBrowser } from "react-device-detect"

export default function useDeviceType() {
  const [device, setDevice] = useState(undefined)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!device) {
      if (isBrowser && !isMobileOnly && !isTablet) {
        setDevice("desktop")
      }
      if (!isBrowser && !isMobileOnly && isTablet) {
        setDevice("tablet")
      }
      if (!isBrowser && isMobileOnly && !isTablet) {
        setDevice("mobile")
      }
    }
  })
  return device
}
