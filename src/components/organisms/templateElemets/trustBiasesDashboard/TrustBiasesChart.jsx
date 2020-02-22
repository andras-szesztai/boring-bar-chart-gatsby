import React, { useRef } from "react"
import { scaleBand } from "d3-scale"
import { select } from "d3-selection"
import chroma from "chroma-js"
import "d3-transition"

import { ChartStarter } from "../../../molecules/charts"
import { useChartRefs, useDimensions, useInitUpdate } from "../../../../hooks"
import { COUNTRY_ORDER } from "../../../../constants/trustBiases"
import { colors, transition } from "../../../../themes/theme"
import { interpolateString } from "d3-interpolate"
import { easeCubicInOut } from "d3-ease"

const { smNum } = transition

export default function TrustBiasesChart({
  data,
  margin,
  handleMouseover,
  handleMouseout,
  colorDomain,
  colorRange,
}) {
  const refs = useChartRefs()
  const valueStore = useRef()
  const dims = useDimensions({
    ref: refs.wrapperRef,
    margin,
  })

  function initVis() {
    const scale = scaleBand().domain(COUNTRY_ORDER)
    const xScale = scale.range([0, dims.chartWidth])
    const yScale = scale.range([0, dims.chartHeight])
    const colorScale = chroma.scale(colorRange).domain(colorDomain)
    const chartArea = select(refs.areaRef.current)
    valueStore.current = {
      xScale,
      yScale,
      colorScale,
      chartArea,
    }
    createRectangles()
  }

  function updateVisDims() {
    const { xScale, yScale, chartArea } = valueStore.current
    yScale.range([0, dims.chartWidth])
    xScale.range([0, dims.chartHeight])
    console.log('runninng')
    chartArea
      .selectAll("rect")
      .attr("x", d => xScale(d.origin))
      .attr("y", d => yScale(d.destination))
      .attr("width", xScale.bandwidth())
      .attr("height", xScale.bandwidth())
    valueStore.current = {
      xScale,
      yScale,
      chartArea,
    }
  }

  function createRectangles() {
    const { xScale, yScale, colorScale, chartArea } = valueStore.current
    chartArea
      .selectAll("rect")
      .data(data)
      .join(enter =>
        enter
          .append("rect")
          .attr("cursor", "pointer")
          .attr("x", d => xScale(d.origin))
          .attr("y", d => yScale(d.destination))
          .attr("width", xScale.bandwidth())
          .attr("height", xScale.bandwidth())
          .attr("fill", d =>
            +d.trust !== 100 ? colorScale(+d.trust) : colors.grayLighter
          )
          .attr("stroke", "#fff")
          .on("mouseover", onMouseover)
          .on("mouseout", onMouseout)
          .on("click", onClick)
      )
  }

  var interpol_rotate = (x, y) =>
    interpolateString(`rotate(0,${x},${y})`, `rotate(-45,${x},${y})`)
  var interpol_rotate_back = (x, y) =>
    interpolateString(`rotate(-45,${x},${y})`, `rotate(0,${x},${y})`)

  const makeTransition = area =>
    area
      .transition()
      .duration(smNum)
      .ease(easeCubicInOut)

  function mouseoverAnimation({ d, i, n }, isOut) {
    const { chartArea, xScale, yScale, colorScale } = valueStore.current
    let oColor, dColor, dTrust, oTrust
    const interpolate = isOut ? interpol_rotate_back : interpol_rotate
    const origin = d.origin
    const dest = d.destination
    const t = makeTransition(chartArea)

    const halfBandwidth = xScale.bandwidth() / 2
    const animateElement = el => {
      el.raise()
      el.transition(t)
        .attrTween("transform", dat =>
          interpolate(
            xScale(dat.origin) + halfBandwidth,
            yScale(dat.destination) + halfBandwidth
          )
        )
        .attr("stroke", d =>
          !isOut ? chroma(colorScale(+d.trust)).darken(3) : "#fff"
        )
      return el.attr("fill")
    }
    oColor = animateElement(select(n[i]))
    oTrust = +d.trust
    chartArea.selectAll("rect").each((data, index, elements) => {
      if (
        dest !== origin &&
        data.origin === dest &&
        data.destination === origin
      ) {
        dColor = animateElement(select(elements[index]))
        dTrust = +data.trust
      }
    })
    return {
      origin,
      dest,
      oColor,
      dColor,
      dTrust,
      oTrust,
    }
  }

  function onMouseover(d, i, n) {
    const curr = mouseoverAnimation({ d, i, n })
    handleMouseover(curr)
  }

  function onMouseout(d, i, n) {
    mouseoverAnimation({ d, i, n }, true)
    handleMouseout()
  }

  function onClick(d) {
    console.log(d, "clicked")
  }

  useInitUpdate({
    data: data && Object.values(data),
    chartHeight: dims.chartHeight,
    chartWidth: dims.chartWidth,
    initVis,
    updateVisDims,
  })

  return (
    <>
      <ChartStarter refs={refs} dims={dims} margin={margin} fontSize={0} />
    </>
  )
}

TrustBiasesChart.defaultProps = {
  margin: { top: 10, bottom: 10, left: 10, right: 10 },
}
