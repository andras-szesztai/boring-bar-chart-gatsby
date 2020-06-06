import { useReducer, useEffect } from "react"

import { scaleTime, scaleSqrt } from "d3-scale"
import { extent } from "d3-array"
import { usePrevious } from "../../../../../../hooks"

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
  hoveredMovie: {
    id: undefined,
    data: {},
    position: undefined,
  },
}

const SET_CHART_START_SETTINGS = "SET_CHART_START_SETTINGS"
const SET_IS_Y_DOMAIN_SYNCED = "SET_IS_Y_DOMAIN_SYNCED"
const SET_IS_SIZE_DYNAMIC = "SET_IS_SIZE_DYNAMIC"
const SET_HOVERED_MOVIE = "SET_HOVERED_MOVIE"

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
    SET_IS_Y_DOMAIN_SYNCED: () => ({
      ...state,
      isYDomainSynced: !state.isYDomainSynced,
    }),
    SET_IS_SIZE_DYNAMIC: () => ({
      ...state,
      isSizeDynamic: !state.isSizeDynamic,
    }),
    SET_HOVERED_MOVIE: () => ({
      ...state,
      hoveredMovie: payload,
    }),
  }
  return types[type] ? types[type]() : state
}

export default function useMovieSelectorChartReducer({ dataSets }) {
  //const prevDataSets = usePrevious(dataSets)
  const [chartState, dispatch] = useReducer(
    movieSelectorChartReducer,
    initialState
  )

  const actions = {
    setChartStartSettings: payload =>
      dispatch({ type: SET_CHART_START_SETTINGS, payload }),
    setIsYDomainSynced: () => dispatch({ type: SET_IS_Y_DOMAIN_SYNCED }),
    setIsSizeSynced: () => dispatch({ type: SET_IS_SIZE_DYNAMIC }),
    setHoveredMovie: payload => dispatch({ type: SET_HOVERED_MOVIE, payload }),
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

  return { chartState, actions }
}
