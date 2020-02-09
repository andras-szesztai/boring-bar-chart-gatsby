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
  parentHeight,
}) {
  const [dims, setDims] = useState({
    width: undefined,
    height: undefined,
    chartWidth: undefined,
    chartHeight: undefined,
  })

  useEffect(() => {
    function getDimensions() {
      if ((ref && ref.current) || (parentRef && parentRef.current)) {
        const width = parentWidth
          ? parentRef.current.offsetWidth
          : ref.current.offsetWidth
        const height = parentHeight
          ? parentRef.current.offsetHeight
          : ref.current.offsetHeight

        if (dims.width !== width || height !== dims.height) {
          setDims({
            width,
            height,
            chartWidth: width - margin.left - margin.right,
            chartHeight: height - margin.top - margin.bottom,
          })
        }
      }
    }
    if (
      !dims.height &&
      (ref || parentRef) &&
      (ref.current || parentRef.current)
    ) {
      window.addEventListener("resize", getDimensions)
      getDimensions()
    }
    if (dims.width && dims.height) {
      if (
        parentRef &&
        (parentRef.current.clientWidth !== dims.width ||
          parentRef.current.clientHeight !== dims.height)
      ) {
        getDimensions()
      }
      if (
        ref &&
        (ref.current.clientWidth !== dims.width ||
          ref.current.clientHeight !== dims.height)
      ) {
        getDimensions()
      }
    }
    // TODO: figure out how to use it
    // return  window.removeEventListener("resize", getDimensions)
  }, [dims, margin, parentHeight, parentRef, parentWidth, ref])

  return dims
}
