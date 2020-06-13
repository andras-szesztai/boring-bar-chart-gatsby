import { useEffect } from "react"
import chroma from "chroma-js"
import "d3-transition"

import { usePrevious } from "../../../../../../../hooks"
import { COLORS } from "../../../../../../../constants/moviesDashboard"
import { makeTransition } from "../../../../../../../utils/chartHelpers"
import { transition } from "../../../../../../../themes/theme"

export default function useFavoriteUpdate({ storedValues, favoriteMovies }) {
  const prevFavoriteMovies = usePrevious(favoriteMovies)
  const { isInit, chartArea } = storedValues.current
  useEffect(() => {
    if (isInit && prevFavoriteMovies.length !== favoriteMovies.length) {
      chartArea
        .selectAll(".main-circle .circle")
        .transition(makeTransition(chartArea, transition.smNum, "fil-update"))
        .attr("fill", ({ id }) =>
          favoriteMovies.includes(id) ? COLORS.favorite : COLORS.secondary
        )
        .attr("stroke", ({ id }) =>
          favoriteMovies.includes(id)
            ? chroma(COLORS.favorite).darken()
            : chroma(COLORS.secondary).darken()
        )
    }
  }, [chartArea, favoriteMovies, isInit, prevFavoriteMovies])
}
