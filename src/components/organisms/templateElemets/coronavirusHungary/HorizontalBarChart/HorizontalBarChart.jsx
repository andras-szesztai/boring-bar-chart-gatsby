import React, { useEffect, useState, useRef } from "react"
import _ from "lodash"
import { select } from "d3-selection"
import { scaleLinear, scaleBand } from "d3-scale"
import { max, min } from "d3-array"
import chroma from "chroma-js"

import { ChartSvg, ChartWrapper, ChartArea, AxisLine } from "../../../../atoms"
import { useChartRefs, useDimensions, usePrevious } from "../../../../../hooks"
import { chartColors, lowOpacity } from "../../../../../constants/visualizations/coronavirusHungary"
import { makeTransition } from "../../../../../utils/chartHelpers"
import { transition } from "../../../../../themes/theme"

export default function HorizontalBarChart({ margin, data }) {
  const { svgRef, wrapperRef, yAxisRef } = useChartRefs()
  const dims = useDimensions({
    ref: wrapperRef,
    margin,
  })
  const [init, setInit] = useState(false)
  const storedValues = useRef()
  const lineRef = useRef()
  const prevData = usePrevious(data)
  const prevDims = usePrevious(dims)

  useEffect(() => {
    function createUpdateRectangles() {
      const { yScale, xScale, area } = storedValues.current
      const chartData = [
        { gender: "female", num: data.female },
        { gender: "male", num: data.male },
      ]

      const setColor = ({ gender }) =>
        gender === "male" ? chartColors.male : chartColors.female

      area
        .selectAll("rect")
        .data(chartData)
        .join(
          enter =>
            enter
              .append("rect")
              .attr("x", 0)
              .attr("width", ({ num }) => xScale(num))
              .attr("y", ({ gender }) => yScale(gender))
              .attr("height", yScale.bandwidth())
              .attr("fill", d => chroma(setColor(d)).alpha(lowOpacity))
              .attr("stroke", setColor),
          update =>
            update.call(update =>
              update
                .transition(makeTransition(area, transition.lgNum, "update"))
                .attr("width", d => xScale(d))
            )
        )

      select(lineRef.current).raise()
    }

    function updateDims() {
      const { yScale, xScale, area } = storedValues.current
      yScale.rangeRound([0, dims.chartHeight])
      xScale.range([0, dims.chartWidth])
      area
        .selectAll("rect")
        .attr("width", ({ num }) => xScale(num))
        .attr("y", ({ gender }) => yScale(gender))
        .attr("height", yScale.bandwidth())
      storedValues.current = { ...storedValues.current, yScale, xScale }
    }

    if (!init && data.total) {
      const area = select(yAxisRef.current)
      const yScale = scaleBand()
        .rangeRound([0, dims.chartHeight])
        .domain(["female", "male"])
        .paddingOuter(0.15)
        .paddingInner(0.4)
      const xScale = scaleLinear()
        .range([0, dims.chartWidth])
        .domain([0, max(Object.values(data)) - min(Object.values(data))])
      storedValues.current = { yScale, xScale, area }
      createUpdateRectangles()
      setInit(true)
    }
    if (init && !_.isEqual(data, prevData)) {
    }
    if (init && !_.isEqual(prevDims, dims)) {
      updateDims()
    }
  }, [init, data, yAxisRef, dims, prevData, prevDims])

  return (
    <ChartWrapper ref={wrapperRef}>
      <ChartSvg absPos ref={svgRef} width={dims.width} height={dims.height}>
        <ChartArea
          marginLeft={margin.left}
          marginTop={margin.top}
          ref={yAxisRef}
        >
          <AxisLine
            color="grayDarkest"
            ref={lineRef}
            stroke={0.5}
            y1={0}
            y2={dims.chartHeight}
          />
        </ChartArea>
      </ChartSvg>
    </ChartWrapper>
  )
}

HorizontalBarChart.defaultProps = {
  margin: { top: 15, right: 50, bottom: 15, left: 20 },
}
