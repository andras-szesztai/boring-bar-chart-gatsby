import _ from "lodash"
import { extent } from "d3-array"
import { select } from "d3-selection"
import { interpolateNumber } from "d3-interpolate"
import { format } from "d3-format"
import { easeCubicInOut } from "d3-ease"

export function checkIfUpdated(sortedRaw, sortedPrevRaw) {
  return sortedRaw
    .map((el, i) => _.isEqual(el, sortedPrevRaw[i]))
    .includes(false)
}

export const getClassName = value =>
  value && value.toLowerCase().replace(/[ -.,:]/g, "")

export function getAxisPadding(data, key, domainPaddingValue = 0.025) {
  const minmax = extent(data, d => d[key])
  const minmaxDiff = minmax[1] - minmax[0]
  const domainPadding = minmaxDiff * domainPaddingValue
  return domainPadding
}

export function numberTween({ value, i, n, numberFormat, prevValue }) {
  return function(t) {
    select(n[i]).text(
      format(numberFormat)(interpolateNumber(prevValue, value)(t))
    )
  }
}

export const makeTransition = (area, duration, name) =>
  area
    .transition(name)
    .duration(duration)
    .ease(easeCubicInOut)

export function createUpdateNumberText({
  duration,
  textDy,
  xScale,
  yScale,
  data,
  prevData,
  xKey,
  yKey,
  ref,
  numberFormat,
  isHidden,
  moveTextHigher,
}) {
  const getNumberTween = (d, i, n) =>
    numberTween({
      value: data.find(el => el[xKey] === d[xKey])[yKey],
      prevValue: prevData ? prevData.find(el => el[xKey] === d[xKey])[yKey] : 0,
      i,
      n,
      numberFormat,
    })
  select(ref)
    .selectAll(".number-text")
    .data(data, d => d[xKey])
    .join(
      enter =>
        enter
          .append("text")
          .attr("x", d => xScale(d[xKey]) + xScale.bandwidth() / 2)
          .attr("class", "number-text")
          .attr("y", yScale(0))
          .attr("dy", moveTextHigher * textDy)
          .attr("text-anchor", "middle")
          .attr("opacity", isHidden ? 0 : 1)
          .text(0)
          .call(enter =>
            enter
              .transition()
              .duration(duration)
              .delay((_, i) => (i * duration) / data.length)
              .ease(easeCubicInOut)
              .attr("y", d => yScale(d[yKey]))
              .tween("text", getNumberTween)
          ),
      update =>
        update.call(update =>
          update
            .transition()
            .duration(duration)
            .ease(easeCubicInOut)
            .attr("x", d => xScale(d[xKey]) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d[yKey]))
            .tween("text", getNumberTween)
        )
    )
}

export function changedFormat(val, metricIsPercentage) {
  function returnFormatString(val, metricIsPercentage) {
    if (metricIsPercentage) {
      if (val >= 1) return ".0%"
      if (val >= 0.1) return ".1%"
      return ".2%"
    }
    if (val < 1) return ".2f"
    return ".3s"
  }

  return format(returnFormatString(val, metricIsPercentage))(val).replace(
    "G",
    "B"
  )
}

export function newNNumberTween({
  value,
  i,
  n,
  prevValue,
  metricIsPercentage,
}) {
  return function(t) {
    select(n[i]).text(
      changedFormat(interpolateNumber(prevValue, value)(t), metricIsPercentage)
    )
  }
}
