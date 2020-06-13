import { useReducer } from "react"

import { usePrevious, useLocalStorage } from "../../hooks"

import {
  LOCAL_STORE_ACCESSORS,
  NO_ACTIVE_MOVIE,
} from "../../constants/moviesDashboard"
import {
  useActiveMovieCredits,
  useFetchGenres,
  useFetchPersonCredit,
} from "./hooks"

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
    favoriteMovies,
  }

  const localStorageSetters = {
    setFavoritePersons,
    setFavoriteMovies,
  }

  const actions = {
    setActiveNameID: payload => dispatch({ type: SET_ACTIVE_ID, payload }),
    setActiveMovie: payload => dispatch({ type: SET_ACTIVE_MOVIE, payload }),
    openPersonDetails: () => dispatch({ type: OPEN_PERSON_DETAILS_CARD }),
    closePersonDetails: () => dispatch({ type: CLOSE_PERSON_DETAILS_CARD }),
  }

  useFetchGenres(dispatch)
  useFetchPersonCredit({
    activeNameID: state.activeNameID,
    prevActiveNameID: prevState && prevState.activeNameID,
    dispatch,
  })
  useActiveMovieCredits({
    activeMovie: state.activeMovie,
    prevActiveMovie: prevState && prevState.activeMovie,
    dispatch,
  })

  return { state, prevState, actions, localStorageValues, localStorageSetters }
}
