import { useReducer, useEffect } from "react"
import axios from "axios"

import { usePrevious, useLocalStorage } from "../../hooks"

import {
  API_ROOT,
  LOCAL_STORE_ACCESSORS,
} from "../../constants/moviesDashboard"
import { scaleTime, scaleSqrt } from "d3-scale"
import { extent } from "d3-array"

const initialState = {
  nameId: undefined,
  types: {
    main: undefined,
    sub: undefined,
  },
  isBoth: undefined,
  scales: {
    xScale: undefined,
    sizeScale: undefined,
  },
  isYDomainSynced: true,
  isSizeDynamic: true,
}

const SET_CHART_START_SETTINGS = "SET_CHART_SETTINGS"

function movieSelectorChartReducer(state, { type, payload }) {
  const types = {
    SET_CHART_START_SETTINGS: () => ({
      ...state,
      nameId: payload.nameId,
      types: {
        main: payload.mainType,
        sub: payload.subType,
      },
      isBoth: payload.isBoth,
      scales: {
        xScale: payload.xScale,
        sizeScale: payload.sizeScale,
      },
    }),
  }
  return types[type] ? types[type]() : state
}

export default function useMovieSelectorChartReducer({ dataSets }) {
  const [chartState, chartDispatch] = useReducer(
    movieSelectorChartReducer,
    initialState
  )
  //const prevChartState = usePrevious(chartState)

  const actions = {
    setChartStartSettings: payload =>
      chartDispatch({ type: SET_CHART_START_SETTINGS, payload }),
  }

  useEffect(() => {
    if (
      dataSets.personCredits &&
      (!chartState.nameId || chartState.nameId !== dataSets.personCredits.id)
    ) {
      const isBoth =
        !!dataSets.personCredits.cast.length &&
        !!dataSets.personCredits.crew.length
      const data = [
        ...dataSets.personCredits.crew,
        ...dataSets.personCredits.cast,
      ].filter(d => !!d.release_date && !!d.vote_count)
      const xScale = scaleTime().domain(
        extent(data, d => new Date(d.release_date))
      )
      const sizeScale = scaleSqrt().domain(extent(data, d => d.vote_count))
      const isActor = dataSets.personDetails.known_for_department === "Acting"
      actions.setChartStartSettings({
        nameId: dataSets.personCredits.id,
        mainType: isActor ? "cast" : "crew",
        subType: isBoth && isActor ? "crew" : "cast",
        isBoth,
        xScale,
        sizeScale,
      })
    }
  }, [actions, chartState, dataSets])


// const [isYDomainSynced, setYDomainSynced] = useState(true)
// const [isSizeDynamic, setIsSizeDynamic] = useState(true)
}
