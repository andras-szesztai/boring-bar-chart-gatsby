import { useEffect } from "react"
import uniqBy from "lodash/uniqBy"
import { scaleTime, scaleSqrt } from "d3-scale"
import { extent } from "d3-array"

export default function useChartSettings({
  dataSets: { personCredits, personDetails },
  nameId,
  setChartStartSettings
}) {
  useEffect(() => {
    if (personCredits && (!nameId || nameId !== personCredits.id)) {
      const isBoth = !!personCredits.cast.length && !!personCredits.crew.length
      const data = [...personCredits.crew, ...personCredits.cast]
      const movieSearchData = uniqBy(data, "id")
        .map(el => ({
          id: el.id,
          title: el.title || el.name,
          data: { ...el, release_year: el.unified_year },
        }))
        .sort((a, b) => b.popularity - a.popularity)
      const xScale = scaleTime().domain(
        extent(data, d => new Date(d.unified_date))
      )
      const sizeScale = scaleSqrt().domain(extent(data, d => d.vote_count))
      const isActor = personDetails.known_for_department === "Acting"
      setChartStartSettings({
        nameId: personCredits.id,
        mainType: isActor ? "cast" : "crew",
        subType: isBoth && isActor ? "crew" : "cast",
        isBoth,
        xScale,
        sizeScale,
        movieSearchData,
      })
    }
  }, [nameId, personCredits, personDetails, setChartStartSettings])
}
