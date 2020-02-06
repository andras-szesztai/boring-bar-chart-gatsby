import { useRef } from "react"

export default function() {
  const wrapperRef = useRef()
  const svgRef = useRef()
  const areaRef = useRef()
  const xAxisRef = useRef()

  return { wrapperRef, svgRef, areaRef, xAxisRef }
}
