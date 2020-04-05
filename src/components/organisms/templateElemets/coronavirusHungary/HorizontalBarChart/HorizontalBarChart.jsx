import React, { useEffect, useState, useRef } from "react"
import _ from "lodash"
import { select } from "d3-selection"
import { scaleLinear, scaleBand } from "d3-scale"

import { ChartSvg, ChartWrapper, ChartArea, AxisLine } from "../../../../atoms"
import { useChartRefs, useDimensions, usePrevious } from "../../../../../hooks"
import { chartColors } from "../../../../../constants/visualizations/coronavirusHungary"
import { makeTransition } from "../../../../../utils/chartHelpers"
import { colors, transition } from "../../../../../themes/theme"

export default function HorizontalBarChart({ margin, data }) {
  const { svgRef, wrapperRef, yAxisRef } = useChartRefs()
  const dims = useDimensions({
    ref: wrapperRef,
    margin,
  })
  const [init, setInit] = useState(false)
  const storedValues = useRef()
  const prevData = usePrevious(data)

  useEffect(() => {
    function createUpdateRectangles() {
      const { yScale, xScale } = storedValues.current
      const area = select(yAxisRef.current)
      area
        .selectAll("rect")
        .data(data)
        .join(
          enter =>
            enter
              .append("rect")
              .attr("x", 0)
              .attr("width", d => xScale(d))
              .attr("y", ({ gender }) => yScale(gender))
              .attr("height", yScale.bandwidth())
              .attr("fill", colors.grayDarkest),
          update =>
            update.call(update =>
              update
                .transition(makeTransition(area, transition.lgNum, "update"))
                .attr("width", d => xScale(d))
            )
        )
    }

    if (!init && data.total) {
      const yScale = scaleBand()
        .rangeRound([0, dims.chartHeight])
        .domain(["Nő", "Férfi"])
        .paddingOuter(0.15)
        .paddingInner(0.3)
      const xScale = scaleLinear()
        .range([0, dims.chartWidth])
        .domain([0, 10])
      storedValues.current = { yScale, xScale }
      createUpdateRectangles()
      setInit(true)
    }
    if(init && !_.isEqual(data, prevData)) {}
  }, [init, data, yAxisRef, dims, prevData])

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
  margin: { top: 10, right: 15, bottom: 10, left: 15 },
}
