import { useRef } from "react"

export default function() {
  const wrapperRef = useRef(null)
  const svgRef = useRef(null)
  const areaRef = useRef(null)
  const xAxisRef = useRef(null)
  const xGridRef = useRef(null)
  const yAxisRef = useRef(null)
  const yGridRef = useRef(null)
  const titleRef = useRef(null)

  return { wrapperRef, svgRef, areaRef, xAxisRef, yAxisRef, titleRef, xGridRef,yGridRef }
}
