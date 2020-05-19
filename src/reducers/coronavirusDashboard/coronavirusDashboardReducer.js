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

function makeRunningTotal(dateGrouped, key) {
  const allDates = Object.keys(dateGrouped)
  const enrichedAllDates = getDaysArray(
    allDates[0],
    allDates[allDates.length - 1]
  )
  let accumulator = 0
  return enrichedAllDates.map(date => {
    const currAcc = accumulator
    const currVal = dateGrouped[date] ? dateGrouped[date].length : 0
    accumulator += currVal
    return { key, date, value: currAcc + currVal }
  })
}

function getDaysArray(start, end) {
  var arr = []
  for (
    var dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt))
  }
  return arr
}

function makeRunningAvg(dateGrouped, key) {
  const allDates = Object.keys(dateGrouped)
  const enrichedAllDates = getDaysArray(
    allDates[0],
    allDates[allDates.length - 1]
  )
  const enrichedDateGroupped = enrichedAllDates.map(date => ({
    date,
    num: dateGrouped[date] ? dateGrouped[date].length : 0,
  }))
  const movingAvg = enrichedAllDates.map((date, i) => {
    if (
      new Date(date) <
      new Date(
        "Thu Mar 26 2020 00:00:00 GMT+0100 (Central European Standard Time)"
      )
    )
      return { date, key, value: 0 }
    const value = _.meanBy(enrichedDateGroupped.slice(i - 6, i), "num")
    return {
      date,
      key,
      value,
    }
  })
  return movingAvg
}

// TODO: make it ccleaner, move out allDates and ENRICHED ALL ADATES
function makeAvgAge(dateGrouped, key) {
  const allDates = Object.keys(dateGrouped)
  const enrichedAllDates = getDaysArray(
    allDates[0],
    allDates[allDates.length - 1]
  )
  let accumulator = []
  const avgAge = enrichedAllDates.map(date => {
    const currAgeArray = dateGrouped[date]
      ? dateGrouped[date].map(({ age }) => age)
      : []
    accumulator = [...accumulator, ...currAgeArray]
    return {
      date,
      key,
      value: _.mean(accumulator),
    }
  })
  return avgAge
}

function makeRatio(dateGrouped, key, runningTotal) {
  const allDates = Object.keys(dateGrouped)
  const enrichedAllDates = getDaysArray(
    allDates[0],
    allDates[allDates.length - 1]
  )
  let accumulator = 0
  const ratio = enrichedAllDates.map(date => {
    const num = dateGrouped[date] ? dateGrouped[date].length : 0
    accumulator += num
    const runningT = runningTotal.find(
      d => d.date.toString() === date.toString()
    ).value
    return {
      date,
      key,
      value: accumulator / runningT,
    }
  })
  return ratio
}

const SET_FORMATTED_DATA = "SET_FORMATTED_DATA"
const SET_INITIAL_DATES = "SET_INITIAL_DATES"
const UPDATE_CURR_DATE = "UPDATE_CURR_DATE"
const SET_FILTERED_DATA = "SET_FILTERED_DATA"
const SET_DATA_SETS = "SET_DATA_SETS"
const SET_LANGUAGE = "SET_LANGUAGE"
const SET_FULL_LIST_DOMAIN = "SET_FULL_LIST_DOMAIN"
const UPDATE_DISPLAY = "UPDATE_DISPLAY"

export const actions = {
  setLanguage: dispatch => dispatch({ type: SET_LANGUAGE }),
  setFormattedData: (dispatch, payload) =>
    dispatch({ type: SET_FORMATTED_DATA, payload }),
  setInitialDates: dispatch => dispatch({ type: SET_INITIAL_DATES }),
  updateCurrDate: (dispatch, payload) =>
    dispatch({ type: UPDATE_CURR_DATE, payload }),
  setFilteredData: dispatch => dispatch({ type: SET_FILTERED_DATA }),
  setDataSets: dispatch => dispatch({ type: SET_DATA_SETS }),
  setFullListDomain: dispatch => dispatch({ type: SET_FULL_LIST_DOMAIN }),
  updateDisplay: dispatch => dispatch({ type: UPDATE_DISPLAY }),
}

export const coronavirusDashboardInitialState = {
  language: "hu",
  display: "total",
  dates: {
    diff: undefined,
    max: undefined,
    currDate: undefined,
  },
  dataSets: {
    formattedData: undefined,
    filteredData: undefined,
    cumulative: {
      total: undefined,
      gender: undefined,
    },
    daily: {
      total: undefined,
      gender: undefined,
    },
    age: {
      total: undefined,
      gender: undefined,
    },
    ratio: {
      total: undefined,
      gender: undefined,
    },
  },
  fullListDomain: {
    fullAgeDomain: undefined,
    fullAgeList: undefined,
    maxNumber: undefined,
    maxGenderNumber: undefined,
  },
}

export const coronavirusDashboardReducer = (state, { type, payload }) => {
  const {
    dataSets: { formattedData },
    language,
  } = state
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
          min: minDate,
          max: maxDate,
          currDate: maxDate,
        },
      }
    },
    UPDATE_CURR_DATE: () => ({
      ...state,
      dates: {
        ...state.dates,
        currDate: payload,
      },
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
    // SET_DATA_SETS: () => {
    //   const dateSortedData = formattedData.sort((a, b) => a.date - b.date)
    //   const fullMaleData = filterGender({
    //     accessor: "accessorM",
    //     language,
    //     data: dateSortedData,
    //   })
    //   const fullFemaleData = filterGender({
    //     accessor: "accessorF",
    //     language,
    //     data: dateSortedData,
    //   })
    //   const groupedFull = _.groupBy(dateSortedData, "date")
    //   const groupedFemale = _.groupBy(fullMaleData, "date")
    //   const groupedMale = _.groupBy(fullFemaleData, "date")
    //   const runningTotal = makeRunningTotal(groupedFull, "total")
    //   return {
    //     ...state,
    //     dataSets: {
    //       ...state.dataSets,
    //       cumulative: {
    //         total: runningTotal,
    //         gender: [
    //           ...makeRunningTotal(groupedMale, "female"),
    //           ...makeRunningTotal(groupedFemale, "male"),
    //         ],
    //       },
    //       daily: {
    //         total: makeRunningAvg(groupedFull, "total"),
    //         gender: [
    //           ...makeRunningAvg(groupedMale, "female"),
    //           ...makeRunningAvg(groupedFemale, "male"),
    //         ],
    //       },
    //       age: {
    //         total: makeAvgAge(groupedFull, "total"),
    //         gender: [
    //           ...makeAvgAge(groupedMale, "female"),
    //           ...makeAvgAge(groupedFemale, "male"),
    //         ],
    //       },
    //       ratio: {
    //         gender: [
    //           ...makeRatio(groupedMale, "female", runningTotal),
    //           ...makeRatio(groupedFemale, "male", runningTotal),
    //         ],
    //       },
    //     },
    //   }
    // },
    UPDATE_DISPLAY: () => ({
      ...state,
      display: state.display === "total" ? "gender" : "total",
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
      ].sort((a, b) => a - b)
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
