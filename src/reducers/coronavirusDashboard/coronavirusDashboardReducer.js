import { min, max } from "d3-array"
import { differenceInDays } from "date-fns"
import _ from "lodash"

function makeFormattedData({ data, isHu }) {
  if (isHu) {
    return data.map(el => ({
      ...el,
      age: +el.kor,
      date: new Date(el.datum),
      number: +el.sorszam,
      gender: el.nem,
    }))
  }
  return data.map(el => ({
    ...el,
    date: new Date(el.date),
    age: +el.age,
    number: +el.number,
  }))
}

const SET_FORMATTED_DATA = "SET_FORMATTED_DATA"
const SET_INITIAL_DATES = "SET_INITIAL_DATES"
const SET_FILTERED_DATA = "SET_FILTERED_DATA"
const SET_LANGUAGE = "SET_LANGUAGE"

export const initialState = {
  language: "hu",
  dates: {
    diff: undefined,
    max: undefined,
    currDate: undefined,
  },
  numbers: {
    total: 0,
    male: 0,
    female: 0,
  },
  dataSets: {
    formattedData: undefined,
    filteredData: undefined,
  },
}

export const coronavirusDashboardReducer = (state, { type, payload }) => {
  const types = {
    SET_LANGUAGE: () => ({
      ...state,
      language: state.language === "hu" ? "en" : "hu",
    }),
    SET_FORMATTED_DATA: () => ({
      ...state,
      dataSets: {
        ...state.dataSets,
        formattedData: makeFormattedData({
          data: payload.data,
          isHu: state.language === "hu",
        }),
      },
    }),
    SET_INITIAL_DATES: () => {
      const formattedData = state.dataSets.formattedData
      const minDate = _.minBy(formattedData, "date").date
      const maxDate = _.maxBy(formattedData, "date").date
      return {
        ...state,
        dates: {
          diff: minDate,
          max: maxDate,
          currDate: differenceInDays(minDate, maxDate),
        },
      }
    },
    SET_FILTERED_DATA: () => ({
      ...state,
      dataSets: {
        ...state.dataSets,
        filteredData: state.dataSets.formattedData.filter(
          ({ date }) => date.getTime() <= state.dates.currDate.getTime()
        ),
      },
    }),
  }
  return types[type]() || state
}

export const actions = {
  setLanguage: dispatch => dispatch({ type: SET_LANGUAGE }),
  setFormattedData: (dispatch, payload) =>
    dispatch({ type: SET_FORMATTED_DATA, payload }),
  setInitialDates: dispatch => dispatch({ type: SET_INITIAL_DATES }),
  setFilteredData: dispatch => dispatch({ type: SET_FILTERED_DATA }),
}
