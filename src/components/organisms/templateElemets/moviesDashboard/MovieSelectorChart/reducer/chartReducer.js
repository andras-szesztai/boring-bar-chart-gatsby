import { useReducer } from "react"
import { useChartSettings } from "./hooks"

const initialState = {
  nameId: undefined,
  movieSearchData: [],
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
    yPosition: undefined,
    xPosition: undefined,
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
      movieSearchData: payload.movieSearchData,
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
      isYDomainSynced: payload,
    }),
    SET_IS_SIZE_DYNAMIC: () => ({
      ...state,
      isSizeDynamic: payload,
    }),
    SET_HOVERED_MOVIE: () => ({
      ...state,
      hoveredMovie: payload,
    }),
  }
  return types[type] ? types[type]() : state
}

export default function useMovieSelectorChartReducer({ dataSets }) {
  const [state, dispatch] = useReducer(movieSelectorChartReducer, initialState)

  const actions = {
    setChartStartSettings: payload =>
      dispatch({ type: SET_CHART_START_SETTINGS, payload }),
    setIsYDomainSynced: payload =>
      dispatch({ type: SET_IS_Y_DOMAIN_SYNCED, payload }),
    setIsSizeSynced: payload =>
      dispatch({ type: SET_IS_SIZE_DYNAMIC, payload }),
    setHoveredMovie: payload => dispatch({ type: SET_HOVERED_MOVIE, payload }),
  }

  useChartSettings({
    dataSets,
    nameId: state.nameId,
    setChartStartSettings: actions.setChartStartSettings,
  })

  return { state, actions }
}
