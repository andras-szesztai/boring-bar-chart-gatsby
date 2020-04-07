import React, { useEffect, useState, useRef } from "react"
import _ from "lodash"
import { select } from "d3-selection"
import { scaleLinear } from "d3-scale"
import chroma from "chroma-js"

import { ChartSvg, ChartWrapper, ChartArea, AxisLine } from "../../../../atoms"
import { useChartRefs, useDimensions, usePrevious } from "../../../../../hooks"
import {
  chartColors,
  lowOpacity,
} from "../../../../../constants/visualizations/coronavirusHungary"
import { makeTransition } from "../../../../../utils/chartHelpers"
import { transition } from "../../../../../themes/theme"

export default function HorizontalBarChart({ margin, data }) {
  const { svgRef, wrapperRef, areaRef } = useChartRefs()
  const dims = useDimensions({
    ref: wrapperRef,
    margin,
  })
  const [init, setInit] = useState(false)
  const storedValues = useRef()
  const prevData = usePrevious(data)
  const prevDims = usePrevious(dims)

  useEffect(() => {
    function createUpdateRectangles() {
      const { xScale, area } = storedValues.current
      const chartData = [
        { gender: "female", start: 0, num: data.female / data.total },
        {
          gender: "male",
          start: data.female / data.total,
          num: data.male / data.total,
        },
      ]
      const setColor = ({ gender }) =>
        gender === "male" ? chartColors.male : chartColors.female
      const updateAttrs = curr =>
        curr
          .attr("x", ({ start }) => xScale(start))
          .attr("width", ({ num }) => xScale(num))

      area
        .selectAll("rect")
        .data(chartData)
        .join(
          enter =>
            enter
              .append("rect")
              .attr("y", 0)
              .attr("height", dims.chartHeight)
              .attr("fill", d => chroma(setColor(d)).alpha(lowOpacity))
              .attr("stroke", setColor)
              .call(updateAttrs),
          update =>
            update.call(update =>
              update
                .transition(makeTransition(area, transition.lgNum, "update"))
                .call(updateAttrs)
            )
        )
    }

    function updateDims() {
      const { xScale, area } = storedValues.current
      xScale.range([0, dims.chartWidth])
      area
        .selectAll("rect")
        .attr("x", ({ start }) => xScale(start))
        .attr("width", ({ num }) => xScale(num))
        .attr("height", dims.chartHeight)
      storedValues.current = { ...storedValues.current, xScale }
    }

    if (!init && data.total) {
      const area = select(areaRef.current)
      const xScale = scaleLinear()
        .range([0, dims.chartWidth])
        .domain([0, 1])
      storedValues.current = { xScale, area }
      createUpdateRectangles()
      setInit(true)
    }
    if (init && !_.isEqual(data, prevData)) {
      createUpdateRectangles()
    }
    if (init && !_.isEqual(prevDims, dims)) {
      updateDims()
    }
  }, [init, data, dims, prevData, prevDims, areaRef])

  return (
    <ChartWrapper areaRef={wrapperRef}>
      <ChartSvg absPos areaRef={svgRef} width={dims.width} height={dims.height}>
        <ChartArea
          marginLeft={margin.left}
          marginTop={margin.top}
          areaRef={areaRef}
        />
      </ChartSvg>
    </ChartWrapper>
  )
}

HorizontalBarChart.defaultProps = {
  margin: { top: 19, right: 0, bottom: 33, left: 0 },
}
