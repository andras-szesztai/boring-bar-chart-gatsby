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
        ref.current
      ) {
        const width = parentWidth
          ? parentRef.current.offsetWidth
          : ref.current.offsetWidth
        const height = parentHeight
          ? parentRef.current.offsetHeight
          : ref.current.offsetHeight
        if(width !== dims.width || height !== dims.height){
          setDims({
            width,
            height,
            chartWidth: width - (margin.left + margin.right),
            chartHeight: height - (margin.top + margin.bottom),
          })
        }
      }
    }
    window.addEventListener("resize", getDimensions)
    if(!dims.height && ref.current){
      getDimensions()
    }
    // return window.removeEventListener("resize", getDimensions)
    // setTimeout(() => getDimensions(), 1000)
  }, [dims, margin, parentHeight, parentRef, parentWidth, ref])

  return dims
}
