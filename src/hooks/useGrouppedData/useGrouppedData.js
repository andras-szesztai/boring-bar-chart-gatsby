import { useEffect, useState } from "react"
import _ from "lodash"

export default function useGrouppedData(data, accessor) {
  const [grouppedData, setGrouppedData] = useState(undefined)

  useEffect(() => {
    if (!grouppedData && data) {
      setGrouppedData(_.groupBy(data, accessor))
    }
  }, [grouppedData, data, accessor])

  return grouppedData
}
