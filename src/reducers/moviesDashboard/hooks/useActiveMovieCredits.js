import { useEffect } from "react"
import isEqual from "lodash/isEqual"
import uniqBy from "lodash/uniqBy"
import omit from "lodash/omit"
import axios from "axios"

import { API_ROOT } from "../../../constants/moviesDashboard"

import { SET_ACTIVE_MOVIE_CREDITS } from "../moviesDashboardReducer"

export default function useActiveMovieCredits({ prevState, state, dispatch }) {
  useEffect(() => {
    if (
      prevState &&
      state.activeMovie.id &&
      !isEqual(
        omit(state.activeMovie, ["crew", "cast"]),
        omit(prevState.activeMovie, ["crew", "cast"])
      )
    ) {
      axios
        .get(
          `${API_ROOT}/${state.activeMovie.data.media_type}/${state.activeMovie.id}/credits?api_key=${process.env.MDB_API_KEY}&language=en-US`
        )
        .then(response => {
          console.log("response", response)
          dispatch({
            type: SET_ACTIVE_MOVIE_CREDITS,
            payload: {
              cast: uniqBy(response.data.cast, "id").slice(0, 10),
              crew: uniqBy(response.data.crew, "id").slice(0, 10),
            },
          })
        })
    }
  }, [dispatch, prevState, state])
}
