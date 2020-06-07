import { useEffect } from "react"
import isEqual from "lodash/isEqual"
import { usePrevious } from "../../../../../../../hooks"

export default function useChartResize({
  dims,
  storedValues,
  margin,
  createUpdateVoronoi,
  createDateAxis
}) {
  const prevDims = usePrevious(dims)
  useEffect(() => {
    if (storedValues.current.isInit && !isEqual(dims, prevDims)) {
      const {
        currXScale,
      } = storedValues.current
      currXScale.range([0, dims.width - margin.left - margin.right])
      storedValues.current = {
        ...storedValues.current,
        currXScale,
      }
      createDateAxis()
      createUpdateVoronoi()
    }
  }, [createDateAxis, createUpdateVoronoi, dims, margin, prevDims, storedValues])
}
