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

const initialState = {
  activeNameID: undefined,
  activeMovie: NO_ACTIVE_MOVIE,
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

const FETCH_GENRES = "FETCH_GENRES"
const FETCH_GENRES_SUCCESS = "FETCH_GENRES_SUCCESS"
const FETCH_GENRES_FAIL = "FETCH_GENRES_FAIL"
const SET_ACTIVE_ID = "SET_ACTIVE_ID"
const SET_ACTIVE_MOVIE = "SET_ACTIVE_MOVIE"
const SET_ACTIVE_MOVIE_CREDITS = "SET_ACTIVE_MOVIE_CREDITS"
const FETCH_INFO_BY_ID = "FETCH_INFO_BY_ID"
const FETCH_INFO_BY_ID_SUCCESS = "FETCH_INFO_BY_ID_SUCCESS"
const FETCH_INFO_BY_ID_FAIL = "FETCH_INFO_BY_ID_FAIL"
const OPEN_PERSON_DETAILS_CARD = "OPEN_PERSON_DETAILS_CARD"
const CLOSE_PERSON_DETAILS_CARD = "CLOSE_PERSON_DETAILS_CARD"

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
      activeNameID: payload,
      activeMovie: NO_ACTIVE_MOVIE,
    }),
    SET_ACTIVE_MOVIE: () => ({
      ...state,
      activeMovie: {
        ...state.activeMovie,
        id: payload.id,
        data: payload.data || {},
        position: payload.position,
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

  const localStorageValues = {
    favoritePersons,
  }

  const localStorageSetters = {
    setFavoritePersons,
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
                credits: credits.data,
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

  useEffect(() => {
    if (
      prevState &&
      state.activeMovie.id &&
      !_.isEqual(state.activeMovie, prevState.activeMovie)
    ) {
      axios
        .get(
          `${API_ROOT}/${state.activeMovie.data.media_type}/${state.activeMovie.id}/credits?api_key=${process.env.MDB_API_KEY}&language=en-US`
        )
        .then(response =>
          dispatch({
            type: SET_ACTIVE_MOVIE_CREDITS,
            payload: {
              cast: _.uniq(response.data.cast.map(d => d.name)).slice(0, 5),
              crew: _.uniq(response.data.crew.map(d => d.name)).slice(0, 5),
            },
          })
        )
    }
  }, [prevState, state])

  return { state, prevState, actions, localStorageValues, localStorageSetters }
}
