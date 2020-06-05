import { useEffect } from "react"
import isEqual from "lodash/isEqual"
import uniq from "lodash/uniq"
import axios from "axios"

import {
  API_ROOT
} from "../../../constants/moviesDashboard"

import { SET_ACTIVE_MOVIE_CREDITS } from "../moviesDashboardReducer"

export default function useActiveMovieCredits({
  prevState,
  state,
  dispatch
}) {
  useEffect(() => {
    if (
      prevState &&
      state.activeMovie.id &&
      !isEqual(state.activeMovie, prevState.activeMovie)
    ) {
      axios
        .get(
          `${API_ROOT}/${state.activeMovie.data.media_type}/${state.activeMovie.id}/credits?api_key=${process.env.MDB_API_KEY}&language=en-US`
        )
        .then(response =>{
          dispatch({
            type: SET_ACTIVE_MOVIE_CREDITS,
            payload: {
              cast: uniq(response.data.cast.map(d => d.name)).slice(0, 5),
              crew: uniq(response.data.crew.map(d => d.name)).slice(0, 10),
            },
          })
        })
    }
  }, [dispatch, prevState, state])
}
