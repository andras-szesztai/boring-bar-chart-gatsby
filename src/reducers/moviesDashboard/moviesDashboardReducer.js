import { useReducer, useEffect } from "react"
import axios from "axios"

import { usePrevious } from "../../hooks"
import { API_ROOT } from "../../constants/moviesDashboard"

const initialState = {
  activeNameID: undefined,
  dataSets: {
    personDetails: undefined,
    personCredits: undefined,
  },
  personDetailsCard: {
    isOpen: true,
  },
}

// export const fetch

const SET_ACTIVE_ID = "SET_ACTIVE_ID"
const FETCH_INFO_BY_ID = "FETCH_INFO_BY_ID"
const OPEN_PERSON_DETAILS_CARD = "OPEN_PERSON_DETAILS_CARD"
const CLOSE_PERSON_DETAILS_CARD = "CLOSE_PERSON_DETAILS_CARD"

function moviesDashboardReducer(state, { type, payload }) {
  const types = {
    SET_ACTIVE_ID: () => ({
      ...state,
      activeNameID: payload,
    }),
    FETCH_INFO_BY_ID: () => ({
      ...state,
      dataSets: {
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

  const actions = {
    setActiveNameID: payload => dispatch({ type: SET_ACTIVE_ID, payload }),
    openPersonDetails: () => dispatch({ type: OPEN_PERSON_DETAILS_CARD }),
    closePersonDetails: () => dispatch({ type: CLOSE_PERSON_DETAILS_CARD }),
  }

  useEffect(() => {
    if (state.activeNameID && state.activeNameID !== prevState.activeNameID) {
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
              type: FETCH_INFO_BY_ID,
              payload: {
                details: details.data,
                credits: credits.data,
              },
            })
          })
        )
        .catch(function(error) {
          console.log(error)
        })
    }
  })

  return { state, prevState, actions }
}
