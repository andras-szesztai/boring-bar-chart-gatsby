import { useEffect, useState } from "react"
import usePrevious from "../usePrevious"

export default function(isPortrait) {
  const [orientation, setOrientation] = useState(undefined)
  const prevIsPortrait = usePrevious(isPortrait)
  const getOrientation = portrait => (portrait ? "portrait" : "landscape")
  useEffect(() => {
    if (!orientation && typeof isPortrait == "boolean") {
      setOrientation(getOrientation(isPortrait))
    }
    if (orientation && isPortrait !== prevIsPortrait) {
      setOrientation(getOrientation(isPortrait))
    }
  }, [orientation, isPortrait, prevIsPortrait])
  return orientation
}
