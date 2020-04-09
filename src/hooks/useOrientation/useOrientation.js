import { useState, useLayoutEffect } from "react"

export default function useOrientation({ isLandscape, isPortrait }) {
  const [orientation, setOrientation] = useState(undefined)
  useLayoutEffect(() => {
    if (!orientation && (isLandscape || isPortrait)) {
      setOrientation(isLandscape ? "landscape" : "portrait")
    }
    if (orientation === "portrait" && isLandscape) {
      setOrientation("landscape")
    }
    if (orientation === "landscape" && isPortrait) {
      setOrientation("portrait")
    }
  }, [orientation, isLandscape, isPortrait])

  return orientation
}
