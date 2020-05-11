import { useEffect, useState } from "react"
import usePrevious from "../usePrevious"

export default function(isPortrait, isLandscape) {
  const [orientation, setOrientation] = useState(undefined)
  const prevIsPortrait = usePrevious(isPortrait)
  const getOrientation = portrait => (portrait ? "portrait" : "landscape")
  useEffect(() => {
    if (!orientation && (isPortrait || isLandscape)) {
      setOrientation(getOrientation(isPortrait))
    }
    if (orientation && isPortrait !== prevIsPortrait) {
      setOrientation(getOrientation(isPortrait))
    }
  }, [orientation, isPortrait, prevIsPortrait, isLandscape])
  return orientation
}
