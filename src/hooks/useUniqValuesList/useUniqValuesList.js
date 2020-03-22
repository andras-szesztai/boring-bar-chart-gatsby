import { useState, useEffect } from "react"

export default function useUniqValuesList(data, accessor, toFilterArray = []) {
  const [uniqValuesList, setUniqValuesList] = useState(undefined)

  useEffect(() => {
    if (!uniqValuesList && data && Array.isArray(data) && data.length) {
      setUniqValuesList([
        ...new Set(
          data
            .filter(d => !toFilterArray.includes(d[accessor]))
            .map(d => d[accessor])
        ),
      ])
    }
  }, [uniqValuesList, data, accessor, toFilterArray])

  return uniqValuesList
}
