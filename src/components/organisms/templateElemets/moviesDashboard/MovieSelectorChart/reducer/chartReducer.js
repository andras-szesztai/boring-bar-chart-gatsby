import { useReducer, useEffect } from "react"
import uniqBy from "lodash/uniqBy"

import { scaleTime, scaleSqrt } from "d3-scale"
import { extent } from "d3-array"

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
  //const prevDataSets = usePrevious(dataSets)
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

  useEffect(() => {
    if (
      dataSets.personCredits &&
      (!state.nameId || state.nameId !== dataSets.personCredits.id)
    ) {
      const isBoth =
        !!dataSets.personCredits.cast.length &&
        !!dataSets.personCredits.crew.length
      const data = [
        ...dataSets.personCredits.crew,
        ...dataSets.personCredits.cast,
      ]
      const movieSearchData = uniqBy(data, "id")
        .map(el => ({
          id: el.id,
          title: el.title,
          data: {...el, release_year: el.unified_year},
        }))
        .sort((a, b) => b.popularity - a.popularity)
      const xScale = scaleTime().domain(
        extent(data, d => new Date(d.unified_year))
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
        movieSearchData,
      })
    }
  }, [actions, state, dataSets])

  return { state, actions }
}
