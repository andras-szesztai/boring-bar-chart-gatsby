import { useEffect } from "react"
import isEqual from "lodash/isEqual"
import uniqBy from "lodash/uniqBy"
import omit from "lodash/omit"
import axios from "axios"

import { API_ROOT } from "../../../constants/moviesDashboard"

import { SET_ACTIVE_MOVIE_CREDITS } from "../moviesDashboardReducer"

export default function useActiveMovieCredits({
  prevActiveMovie,
  activeMovie,
  dispatch,
}) {
  useEffect(() => {
    if (
      activeMovie.id &&
      !isEqual(
        omit(activeMovie, ["crew", "cast"]),
        omit(prevActiveMovie, ["crew", "cast"])
      )
    ) {
      axios
        .get(
          `${API_ROOT}/${activeMovie.data.media_type}/${activeMovie.id}/credits?api_key=${process.env.MDB_API_KEY}&language=en-US`
        )
        .then(response => {
          dispatch({
            type: SET_ACTIVE_MOVIE_CREDITS,
            payload: {
              cast: uniqBy(response.data.cast, "id").slice(0, 10),
              crew: uniqBy(response.data.crew, "id").slice(0, 10),
            },
          })
        })
    }
  }, [activeMovie, dispatch, prevActiveMovie])
}
