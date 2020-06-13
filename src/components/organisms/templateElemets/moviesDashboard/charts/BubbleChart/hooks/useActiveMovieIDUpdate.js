import React from "react"
import { select } from "d3-selection"
import chroma from "chroma-js"

import {
  COLORS,
  CIRCLE_ADJUST,
} from "../../../../../../../constants/moviesDashboard"

import { setRadius, getSelectedLineYPos, createRefElements } from "../utils"

export default function useActiveMovieIDUpdate({
  storedValues,
  activeMovieID,
  prevActiveMovieID,
  isSizeDynamic,
  chart,
  dims,
  data,
}) {
  React.useEffect(() => {
    if (storedValues.current.isInit && activeMovieID !== prevActiveMovieID) {
      const { chartArea } = storedValues.current
      chartArea.select(".selected-circle").remove()
      chartArea.select(".selected-line").remove()
      chartArea.select(".hovered-circle").remove()
      chartArea.select(".hovered-line").remove()
      const selectedData = data.find(d => d.id === activeMovieID)
      if (selectedData) {
        createRefElements({
          data,
          activeMovieID,
          storedValues,
          chart,
          isSizeDynamic,
          height: dims.height,
        })
      }
    }
  })
}
