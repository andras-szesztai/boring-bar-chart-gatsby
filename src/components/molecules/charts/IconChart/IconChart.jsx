import React, { useState, useEffect } from "react"
import _ from "lodash"
import { select } from "d3-selection"
import { scaleBand, scaleLinear } from "d3-scale"
import "d3-transition"

import { ChartSvg, ChartArea, AxisLine } from "../../../atoms"
import { useChartRefs, usePrevious } from "../../../../hooks"
import { colors, transition } from "../../../../themes/theme"
import { makeTransition } from "../../../../utils/chartHelpers"

export default function IconChart({ dims }) {
  const { svgRef, yAxisRef } = useChartRefs()
  const margin = { top: 2, right: 2, bottom: 2, left: 2 }
  const chartHeight = dims - (margin.bottom + margin.top)
  const chartWidth = dims - (margin.left + margin.right)

  const [data, setData] = useState([7, 10, 4])
  const prevData = usePrevious(data)
  const [init, setInit] = useState(false)
  const yScale = scaleBand()
    .rangeRound([0, chartHeight])
    .domain([0, 1, 2])
    .paddingOuter(0.15)
    .paddingInner(0.3)
  const xScale = scaleLinear()
    .range([0, chartWidth])
    .domain([0, 10])

  useEffect(() => {
    function createUpdateRects() {
      const area = select(yAxisRef.current)
      area
        .selectAll("rect")
        .data(data)
        .join(
          enter =>
            enter
              .append("rect")
              .attr("x", 0)
              .attr("width", 0)
              .attr("y", (d, i) => yScale(i))
              .attr("height", yScale.bandwidth())
              .attr("fill", colors.grayDarkest)
              .call(enter =>
                enter
                  .transition(makeTransition(area, transition.lgNum, "enter"))
                  .attr("width", d => xScale(d))
              ),
          update =>
            update.call(update =>
              update
                .transition(makeTransition(area, transition.mdNum, "update"))
                .attr("width", d => xScale(d))
            )
        )
    }
    if (yAxisRef && yAxisRef.current && !init) {
      createUpdateRects()
      setInit(true)
    }
    if (init && !_.isEqual(data, prevData)) {
      createUpdateRects()
    }
  }, [data, init, prevData, xScale, yAxisRef, yScale])

  return (
    <ChartSvg
      ref={svgRef}
      height={dims}
      width={dims}
      onClick={() => setData(data.map(() => _.random(2, 10)))}
    >
      <ChartArea marginLeft={margin.left} marginTop={margin.top} ref={yAxisRef}>
        <AxisLine color="grayDarkest" stroke={0.5} y1={0} y2={chartHeight} />
      </ChartArea>
    </ChartSvg>
  )
}
