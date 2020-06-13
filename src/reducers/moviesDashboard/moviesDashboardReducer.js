import { useReducer, useEffect } from "react"
import axios from "axios"
import _ from "lodash"

import { usePrevious, useLocalStorage } from "../../hooks"

import {
  API_ROOT,
  LOCAL_STORE_ACCESSORS,
  NO_ACTIVE_MOVIE,
} from "../../constants/moviesDashboard"
import { useEffectOnce } from "react-use"
import { useActiveMovieCredits } from "./hooks"
import {
  makeUniqData,
  makeFilteredData,
} from "../../components/organisms/templateElemets/moviesDashboard/utils"

const initialState = {
  activeNameID: undefined,
  activeMovie: {
    id: undefined,
    data: {},
    position: undefined,
    cast: [],
    crew: [],
  },
  dataSets: {
    personDetails: undefined,
    personCredits: undefined,
    genres: undefined,
  },
  loading: {
    personDetails: false,
    personCredits: false,
    genres: false,
  },
  error: {
    personDetails: false,
    personCredits: false,
    genres: false,
  },
  personDetailsCard: {
    isOpen: undefined,
  },
}

export const FETCH_GENRES = "FETCH_GENRES"
export const FETCH_GENRES_SUCCESS = "FETCH_GENRES_SUCCESS"
export const FETCH_GENRES_FAIL = "FETCH_GENRES_FAIL"
export const SET_ACTIVE_ID = "SET_ACTIVE_ID"
export const SET_ACTIVE_MOVIE = "SET_ACTIVE_MOVIE"
export const SET_ACTIVE_MOVIE_CREDITS = "SET_ACTIVE_MOVIE_CREDITS"
export const FETCH_INFO_BY_ID = "FETCH_INFO_BY_ID"
export const FETCH_INFO_BY_ID_SUCCESS = "FETCH_INFO_BY_ID_SUCCESS"
export const FETCH_INFO_BY_ID_FAIL = "FETCH_INFO_BY_ID_FAIL"
export const OPEN_PERSON_DETAILS_CARD = "OPEN_PERSON_DETAILS_CARD"
export const CLOSE_PERSON_DETAILS_CARD = "CLOSE_PERSON_DETAILS_CARD"

function moviesDashboardReducer(state, { type, payload }) {
  const types = {
    FETCH_GENRES: () => ({
      ...state,
      loading: {
        ...state.loading,
        genres: true,
      },
    }),
    FETCH_GENRES_SUCCESS: () => ({
      ...state,
      loading: {
        ...state.loading,
        genres: false,
      },
      dataSets: {
        ...state.dataSets,
        genres: payload,
      },
    }),
    FETCH_GENRES_FAIL: () => ({
      ...state,
      loading: {
        ...state.loading,
        genres: false,
      },
      dataSets: {
        ...state.dataSets,
        genres: undefined,
      },
      error: {
        ...state.error,
        genres: payload,
      },
    }),
    SET_ACTIVE_ID: () => ({
      ...state,
      activeNameID: payload.id,
      activeMovie: payload.isActiveMovieClicked
        ? state.activeMovie
        : NO_ACTIVE_MOVIE,
    }),
    SET_ACTIVE_MOVIE: () => ({
      ...state,
      activeMovie: {
        id: payload.id,
        data: payload.data || {},
        position: payload.position,
        cast: [],
        crew: [],
      },
    }),
    SET_ACTIVE_MOVIE_CREDITS: () => ({
      ...state,
      activeMovie: {
        ...state.activeMovie,
        cast: payload.cast || [],
        crew: payload.crew || [],
      },
    }),
    FETCH_INFO_BY_ID: () => ({
      ...state,
      loading: {
        ...state.loading,
        personDetails: true,
        personCredits: true,
      },
    }),
    FETCH_INFO_BY_ID_SUCCESS: () => ({
      ...state,
      loading: {
        ...state.loading,
        personDetails: false,
        personCredits: false,
      },
      dataSets: {
        ...state.dataSets,
        personDetails: payload.details,
        personCredits: payload.credits,
      },
    }),
    FETCH_INFO_BY_ID_FAIL: () => ({
      ...state,
      loading: {
        ...state.loading,
        personDetails: false,
        personCredits: false,
      },
      dataSets: {
        ...state.dataSets,
        personDetails: undefined,
        personCredits: undefined,
      },
      error: {
        ...state.error,
        personDetails: payload.details,
        personCredits: payload.credits,
      },
    }),
    OPEN_PERSON_DETAILS_CARD: () => ({
      ...state,
      personDetailsCard: {
        ...state.personDetailsCard,
        isOpen: true,
      },
    }),
    CLOSE_PERSON_DETAILS_CARD: () => ({
      ...state,
      personDetailsCard: {
        ...state.personDetailsCard,
        isOpen: false,
      },
    }),
  }
  return types[type] ? types[type]() : state
}

export default function useMoviesDashboardReducer() {
  const [state, dispatch] = useReducer(moviesDashboardReducer, initialState)
  const prevState = usePrevious(state)

  const [favoritePersons, setFavoritePersons] = useLocalStorage(
    LOCAL_STORE_ACCESSORS.favoritePersons,
    []
  )

  const [favoriteMovies, setFavoriteMovies] = useLocalStorage(
    LOCAL_STORE_ACCESSORS.favoriteMovies,
    []
  )

  const localStorageValues = {
    favoritePersons,
    favoriteMovies
  }

  const localStorageSetters = {
    setFavoritePersons,
    setFavoriteMovies
  }

  const actions = {
    setActiveNameID: payload => dispatch({ type: SET_ACTIVE_ID, payload }),
    setActiveMovie: payload => dispatch({ type: SET_ACTIVE_MOVIE, payload }),
    openPersonDetails: () => dispatch({ type: OPEN_PERSON_DETAILS_CARD }),
    closePersonDetails: () => dispatch({ type: CLOSE_PERSON_DETAILS_CARD }),
  }

  useEffectOnce(() => {
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
            payload: _.uniqBy([...movie.data.genres, ...tv.data.genres], "id"),
          })
        })
      )
      .catch(function(error) {
        dispatch({
          type: FETCH_GENRES_FAIL,
          payload: error,
        })
      })
  })

  useEffect(() => {
    if (state.activeNameID && state.activeNameID !== prevState.activeNameID) {
      dispatch({ type: FETCH_INFO_BY_ID })
      axios
        .all([
          axios.get(
            `${API_ROOT}/person/${state.activeNameID}?api_key=${process.env.MDB_API_KEY}&language=en-US`
          ),
          axios.get(
            `${API_ROOT}/person/${state.activeNameID}/combined_credits?api_key=${process.env.MDB_API_KEY}&language=en-US`
          ),
        ])
        .then(
          axios.spread((details, credits) => {
            dispatch({
              type: FETCH_INFO_BY_ID_SUCCESS,
              payload: {
                details: details.data,
                credits: {
                  cast: makeUniqData(
                    makeFilteredData(credits.data.cast),
                    "cast"
                  ),
                  crew: makeUniqData(
                    makeFilteredData(credits.data.crew),
                    "crew"
                  ),
                  id: credits.data.id,
                },
              },
            })
          })
        )
        .catch(function(error) {
          dispatch({
            type: FETCH_INFO_BY_ID_FAIL,
            payload: {
              details: error,
              credits: error,
            },
          })
        })
    }
  })

  useActiveMovieCredits({ prevState, state, dispatch })

  return { state, prevState, actions, localStorageValues, localStorageSetters }
}
