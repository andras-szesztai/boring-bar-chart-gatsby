import { useState, useEffect } from "react"

export default function useDimensions({
  ref,
  margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  parentRef,
  parentWidth,
  parentHeight
}) {
  const [dims, setDims] = useState({
    width: undefined,
    height: undefined,
    chartWidth: undefined,
    chartHeight: undefined,
  })

  useEffect(() => {
    function getDimensions() {
      if (
        ref &&
        ref.current &&
        ref.current.offsetWidth &&
        ref.current.offsetHeight
      ) {
        const width = parentWidth
          ? parentRef.current.offsetWidth
          : ref.current.offsetWidth
        const height = parentHeight
          ? parentRef.current.offsetHeight
          : ref.current.offsetHeight
        setDims({
          width,
          height,
          chartWidth: width - (margin.left + margin.right),
          chartHeight: height - (margin.top + margin.bottom),
        })
      }
    }
    window.addEventListener("resize", getDimensions)
    setTimeout(() => getDimensions(), 1000)
  }, [margin.bottom, margin.left, margin.right, margin.top, parentHeight, parentRef, parentWidth, ref])

  return dims
}
