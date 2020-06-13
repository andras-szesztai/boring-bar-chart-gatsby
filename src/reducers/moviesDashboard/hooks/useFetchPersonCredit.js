import { useEffect } from "react"
import axios from "axios"

import { API_ROOT } from "../../../constants/moviesDashboard"

import {
  FETCH_INFO_BY_ID,
  FETCH_INFO_BY_ID_SUCCESS,
  FETCH_INFO_BY_ID_FAIL,
} from "../moviesDashboardReducer"
import {
  makeUniqData,
  makeFilteredData,
} from "../../../components/organisms/templateElemets/moviesDashboard/utils"

export default function useFetchPersonCredit({
  activeNameID,
  prevActiveNameID,
  dispatch,
}) {
  useEffect(() => {
    if (activeNameID && activeNameID !== prevActiveNameID) {
      dispatch({ type: FETCH_INFO_BY_ID })
      axios
        .all([
          axios.get(
            `${API_ROOT}/person/${activeNameID}?api_key=${process.env.MDB_API_KEY}&language=en-US`
          ),
          axios.get(
            `${API_ROOT}/person/${activeNameID}/combined_credits?api_key=${process.env.MDB_API_KEY}&language=en-US`
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
                    makeFilteredData(credits.data.cast, "cast"),
                    "cast"
                  ),
                  crew: makeUniqData(
                    makeFilteredData(credits.data.crew, "crew"),
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
}
