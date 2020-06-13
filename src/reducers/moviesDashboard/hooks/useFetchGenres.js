import { useEffect, useRef } from "react"
import axios from "axios"
import _ from "lodash"

import { API_ROOT } from "../../../constants/moviesDashboard"

import {
  FETCH_GENRES,
  FETCH_GENRES_SUCCESS,
  FETCH_GENRES_FAIL,
} from "../moviesDashboardReducer"

export default function useFetchGenres(dispatch) {
  const isInit = useRef(true)
  useEffect(() => {
    if (isInit.current) {
      isInit.current = false
      dispatch({ type: FETCH_GENRES })
      axios
        .all([
          axios.get(
            `${API_ROOT}/genre/movie/list?api_key=${process.env.MDB_API_KEY}&language=en-US`
          ),
          axios.get(
            `${API_ROOT}/genre/tv/list?api_key=${process.env.MDB_API_KEY}&language=en-US`
          ),
        ])
        .then(
          axios.spread((movie, tv) => {
            dispatch({
              type: FETCH_GENRES_SUCCESS,
              payload: _.uniqBy(
                [...movie.data.genres, ...tv.data.genres],
                "id"
              ),
            })
          })
        )
        .catch(function(error) {
          dispatch({
            type: FETCH_GENRES_FAIL,
            payload: error,
          })
        })
    }
  })
}
