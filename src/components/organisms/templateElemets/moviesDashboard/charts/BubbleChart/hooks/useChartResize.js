import {useEffect} from "react"
import isEqual from "lodash/isEqual"

export default function useChartResize({ dims, prevDims }) {
  useEffect(() => {
    if (prevDims && !!prevDims.width && !isEqual(dims, prevDims)) {
      console.log("dims update")
    }
  }, [dims, prevDims])
}
