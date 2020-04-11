import React, { useState, useEffect, useRef } from "react"
import _ from "lodash"

import { ChartWrapper, ChartSvg } from "../../../../../atoms"
import {
  useChartRefs,
  useDimensions,
  usePrevious,
} from "../../../../../../hooks"
import { TEXT } from "../../../../../../constants/visualizations/coronavirusHungary"
import { select } from "d3-selection"
import { scaleLinear } from "d3-scale"
import { extent } from "d3-array"

const makeAreaData = data => {
  let newData = []
  const grouped = _.groupBy(data, "age")
  for (const age in grouped) {
    newData = [...newData, { age, number: grouped[age].length }]
  }
  return newData
}

export default function VerticalDoubleAreaChart({ margin, data, language }) {
  const { svgRef, wrapperRef } = useChartRefs()
  const storedValues = useRef()
  const dims = useDimensions({
    ref: wrapperRef,
    margin,
  })
  const [init, setInit] = useState(false)
  const prevData = usePrevious(data)
  const [areaDataSets, setAreaDataSets] = useState({})

  useEffect(() => {
    const setDataSets = () =>
      setAreaDataSets({
        total: makeAreaData(data),
        female: makeAreaData(
          data.filter(({ gender }) => gender === TEXT.genderF[language])
        ),
        male: makeAreaData(
          data.filter(({ gender }) => gender === TEXT.genderM[language])
        ),
      })
    if (!prevData && !!data) {
      setDataSets()
      return
    }
    if (prevData && prevData.length !== data.length) {
      setDataSets()
    }
  }, [prevData, data, language])

  useEffect(() => {
    function createUpdateAxisLabels() {
      const { svg, yScale } = storedValues.current
    }
    function createUpdateAreas() {}
    if (!init && areaDataSets.total) {
      const svg = select(svgRef.current)
      const yScale = scaleLinear()
        .range([0, dims.chartHeight])
        .domain(extent(data, ({ age }) => age))
      storedValues.current = { yScale, svg }
      createUpdateAxisLabels()
      setInit(true)
    }
  }, [areaDataSets, data, dims, init, svgRef])

  return (
    <ChartWrapper areaRef={wrapperRef}>
      <ChartSvg
        absPos
        areaRef={svgRef}
        width={dims.width}
        height={dims.height}
      ></ChartSvg>
    </ChartWrapper>
  )
}
