import React, { useEffect, useState, useRef } from "react"
import { max, min } from "d3-array"
import chroma from "chroma-js"
import { select } from "d3-selection"
import { scaleLinear } from "d3-scale"

import { ChartWrapper, ChartSvg, AxisLine, ChartArea } from "../../../../atoms"
import { useChartRefs, useDimensions, usePrevious } from "../../../../../hooks"
import { chartColors, lowOpacity } from "../../../../../constants/visualizations/coronavirusHungary"
import { makeTransition } from "../../../../../utils/chartHelpers"
import { transition, space } from "../../../../../themes/theme"

export default function AgeChartBrowser({ data, margin }) {
  const { svgRef, wrapperRef, xAxisRef, areaRef } = useChartRefs()
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

      const setColor = ({ gender }) =>
        gender === "Férfi" ? chartColors.male : chartColors.female

      console.log(data)
      area
        .selectAll("circle")
        .data(data, ({ number }) => number)
        .join(
          enter =>
            enter
              .append("circle")
              .attr("r", 6)
              .attr("cx", ({ age }) => xScale(age))
              .attr("cy", ({ rand }) => yScale(rand))
              .attr("fill", d => chroma(setColor(d)).alpha(lowOpacity))
              .attr("stroke", setColor),
          update =>
            update.call(update =>
              update
                .transition(makeTransition(area, transition.lgNum, "update"))
                .attr("cx", ({ age }) => xScale(age))
            )
        )

      // select(lineRef.current).raise()
    }

    function updateDims() {
      // const { yScale, xScale, area } = storedValues.current
      // yScale.rangeRound([0, dims.chartHeight])
      // xScale.range([0, dims.chartWidth])
      // area
      //   .selectAll("rect")
      //   .attr("width", ({ num }) => xScale(num))
      //   .attr("y", ({ gender }) => yScale(gender))
      //   .attr("height", yScale.bandwidth())
      // storedValues.current = { ...storedValues.current, yScale, xScale }
    }

    if (!init && data) {
      const area = select(areaRef.current)
      const yScale = scaleLinear()
        .range([0, dims.chartHeight])
        .domain([0, 200])
      const xScale = scaleLinear()
        .range([0, dims.chartWidth])
        .domain([min(data, d => d.age) - 2, max(data, d => d.age) + 2])
      storedValues.current = { yScale, xScale, area }
      createUpdateRectangles()
      setInit(true)
    }
    // if (init && !_.isEqual(data, prevData)) {
    // }
    if (init && !_.isEqual(prevDims, dims)) {
      // updateDims()
    }
  }, [init, data, dims, prevData, prevDims, areaRef])

  return (
    <ChartWrapper ref={wrapperRef}>
      <ChartSvg absPos ref={svgRef} width={dims.width} height={dims.height}>
        <ChartArea
          marginLeft={margin.left}
          marginTop={margin.top}
          ref={areaRef}
        />
        <ChartArea
          marginLeft={margin.left}
          marginTop={margin.top + dims.chartHeight}
          ref={xAxisRef}
        >
          <AxisLine
            color="grayDarkest"
            ref={lineRef}
            stroke={0.5}
            x2={dims.chartWidth}
          />
        </ChartArea>
      </ChartSvg>
    </ChartWrapper>
  )
}

AgeChartBrowser.defaultProps = {
  margin: { top: 10, right: 20, bottom: 25, left: 20 },
}
