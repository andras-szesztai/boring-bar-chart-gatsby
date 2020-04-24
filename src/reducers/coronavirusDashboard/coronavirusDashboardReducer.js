import { min, max } from "d3-array"
import { differenceInDays } from "date-fns"
import _ from "lodash"

import { TEXT } from "../../constants/visualizations/coronavirusHungary"
import { makeAreaData } from "../../components/organisms/templateElemets/coronavirusHungary/utils/dataHelpers"

const filterGender = ({ accessor, data, language }) =>
  data.filter(({ gender }) => gender === TEXT[accessor][language])

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

function makeNumbers(array, lan) {
  const sharedParams = { data: array, language: lan }
  return {
    total: array.length,
    female: filterGender({ ...sharedParams, accessor: "accessorF" }),
    male: filterGender({ ...sharedParams, accessor: "accessorM" }),
  }
}

function makeAverages(array, lan) {
  const sharedParams = { data: array, language: lan }
  return {
    total: _.meanBy(array, "age"),
    female: _.meanBy(
      filterGender({ ...sharedParams, accessor: "accessorF" }),
      "age"
    ),
    male: _.meanBy(
      filterGender({ ...sharedParams, accessor: "accessorM" }),
      "age"
    ),
  }
}

const SET_FORMATTED_DATA = "SET_FORMATTED_DATA"
const SET_INITIAL_DATES = "SET_INITIAL_DATES"
const UPDATE_CURR_DATE= "UPDATE_CURR_DATE"
const SET_FILTERED_DATA = "SET_FILTERED_DATA"
const SET_LANGUAGE = "SET_LANGUAGE"
const SET_NUMBERS = "SET_NUMBERS"
const SET_AVERAGES = "SET_AVERAGES"
const SET_FULL_LIST_DOMAIN = "SET_FULL_LIST_DOMAIN"

export const actions = {
  setLanguage: dispatch => dispatch({ type: SET_LANGUAGE }),
  setFormattedData: (dispatch, payload) =>
    dispatch({ type: SET_FORMATTED_DATA, payload }),
  setInitialDates: dispatch => dispatch({ type: SET_INITIAL_DATES }),
  updateCurrDate: (dispatch, payload) => dispatch({ type: UPDATE_CURR_DATE, payload }),
  setFilteredData: dispatch => dispatch({ type: SET_FILTERED_DATA }),
  setNumbers: dispatch => dispatch({ type: SET_NUMBERS }),
  setAverages: dispatch => dispatch({ type: SET_AVERAGES }),
  setFullListDomain: dispatch => dispatch({ type: SET_FULL_LIST_DOMAIN }),
}

export const  coronavirusDashboardInitialState = {
  language: "hu",
  dates: {
    diff: undefined,
    max: undefined,
    currDate: undefined,
  },
  numbers: {
    total: 0,
    female: 0,
    male: 0,
  },
  averages: {
    total: undefined,
    female: undefined,
    male: undefined,
  },
  dataSets: {
    formattedData: undefined,
    filteredData: undefined,
  },
  fullListDomain: {
    fullAgeDomain: undefined,
    fullAgeList: undefined,
    maxNumber: undefined,
    maxGenderNumber: undefined,
  },
}

export const coronavirusDashboardReducer = (state, { type, payload }) => {
  const { dataSets: {  formattedData  }, language } = state
  const types = {
    SET_LANGUAGE: () => ({
      ...state,
      language: language === "hu" ? "en" : "hu",
    }),
    SET_FORMATTED_DATA: () => ({
      ...state,
      dataSets: {
        ...state.dataSets,
        formattedData: makeFormattedData({
          data: payload.data,
          isHu: language === "hu",
        }),
      },
    }),
    SET_INITIAL_DATES: () => {
      const minDate = _.minBy(formattedData, "date").date
      const maxDate = _.maxBy(formattedData, "date").date
      return {
        ...state,
        dates: {
          diff: differenceInDays(minDate, maxDate),
          max: minDate,
          currDate: maxDate 
        },
      }
    },
    UPDATE_CURR_DATE: () => ({
      ...state,
      dates: {
        ...state.dates,
        currDate: payload
      }
    }),
    SET_FILTERED_DATA: () => ({
      ...state,
      dataSets: {
        ...state.dataSets,
        filteredData: formattedData.filter(
          ({ date }) => date.getTime() <= state.dates.currDate.getTime()
        ),
      },
    }),
    SET_NUMBERS: () => ({
      ...state,
      numbers: makeNumbers(formattedData, language),
    }),
    SET_AVERAGES: () => ({
      ...state,
      averages: makeAverages(formattedData, language),
    }),
    SET_FULL_LIST_DOMAIN: () => {
      const femaleData = filterGender({
        accessor: "accessorF",
        language,
        data: formattedData,
      })
      const maleData = filterGender({
        accessor: "accessorM",
        language,
        data: formattedData,
      })
      const fullAgeDomain = [
        min(formattedData, ({ age }) => age) - 2,
        max(formattedData, ({ age }) => age) + 2,
      ].sort()
      const fullAgeList = []
      for (var i = fullAgeDomain[0]; i <= fullAgeDomain[1]; i++) {
        fullAgeList.push(i)
      }
      const maxNumber = max([
        ...makeAreaData(femaleData, fullAgeList).map(({ number }) => number),
        ...makeAreaData(maleData, fullAgeList).map(({ number }) => number),
      ])
      const maxGenderNumber = max([femaleData.length, maleData.length])
      return {
        ...state,
        fullListDomain: {
          fullAgeDomain,
          fullAgeList,
          maxNumber,
          maxGenderNumber,
        },
      }
    },
  }
  return types[type]() || state
}
