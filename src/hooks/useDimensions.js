import { useState, useEffect, useCallback } from "react"

export default function useDimensions(
  ref,
  margins = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }
) {
  const [dims, setDims] = useState({
    width: undefined,
    height: undefined,
    chartWidth: undefined,
    chartHeight: undefined,
  })

  const getDimensions = useCallback(() => {
    if (
      ref &&
      ref.current &&
      ref.current.offsetWidth &&
      ref.current.offsetHeight
    ) {
      setDims({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
        chartWidth: ref.current.offsetWidth - (margins.left + margins.right),
        chartHeight: ref.current.offsetHeight - (margins.top + margins.bottom),
      })
    }
  }, [margins.bottom, margins.left, margins.right, margins.top, ref])

  useEffect(() => {
    window.addEventListener("resize", getDimensions)
    setTimeout(() => getDimensions(), 1000)
  }, [getDimensions, ref])

  return dims
}
