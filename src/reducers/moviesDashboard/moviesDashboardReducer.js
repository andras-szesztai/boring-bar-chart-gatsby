import { useReducer, useEffect } from "react"
import axios from "axios"

import { usePrevious, useLocalStorage } from "../../hooks"

import {
  API_ROOT,
  LOCAL_STORE_ACCESSORS,
} from "../../constants/moviesDashboard"

const initialState = {
  activeNameID: undefined,
  activeMovie: {
    id: undefined,
    data: {},
    position: undefined,
  },
  dataSets: {
    personDetails: undefined,
    personCredits: undefined,
  },
  loading: {
    personDetails: false,
    personCredits: false,
  },
  personDetailsCard: {
    isOpen: undefined,
  },
}

const SET_ACTIVE_ID = "SET_ACTIVE_ID"
const SET_ACTIVE_MOVIE = "SET_ACTIVE_MOVIE"
const FETCH_INFO_BY_ID = "FETCH_INFO_BY_ID"
const FETCH_INFO_BY_ID_SUCCESS = "FETCH_INFO_BY_ID_SUCCESS"
const FETCH_INFO_BY_ID_FAIL = "FETCH_INFO_BY_ID_FAIL"
const OPEN_PERSON_DETAILS_CARD = "OPEN_PERSON_DETAILS_CARD"
const CLOSE_PERSON_DETAILS_CARD = "CLOSE_PERSON_DETAILS_CARD"

function moviesDashboardReducer(state, { type, payload }) {
  const types = {
    SET_ACTIVE_ID: () => ({
      ...state,
      activeNameID: payload,
    }),
    SET_ACTIVE_MOVIE: () => ({
      ...state,
      activeMovie: {
        id: payload.id,
        data: payload.data || {},
        position: payload.position,
      },
    }),
    FETCH_INFO_BY_ID: () => ({
      ...state,
      loading: {
        personDetails: true,
        personCredits: true,
      },
    }),
    FETCH_INFO_BY_ID_SUCCESS: () => ({
      ...state,
      loading: {
        personDetails: false,
        personCredits: false,
      },
      dataSets: {
        personDetails: payload.details,
        personCredits: payload.credits,
      },
    }),
    FETCH_INFO_BY_ID_FAIL: () => ({
      ...state,
      loading: {
        personDetails: false,
        personCredits: false,
      },
      dataSets: {
        personDetails: undefined,
        personCredits: undefined,
      },
      error: {
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

  return { state, prevState, actions, localStorageValues, localStorageSetters }
}
