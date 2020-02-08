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

export function getAxisPadding(data, key, domainPaddingValue = 0.025) {
  const minmax = extent(data, d => d[key])
  const minmaxDiff = minmax[1] - minmax[0]
  const domainPadding = minmaxDiff * domainPaddingValue
  return domainPadding
}

export function numberTween({ value, i, n, numberFormat }) {
  function multiplierFunction(string) {
    const multipliers = {
      K: 1000,
      M: 1000000,
      G: 1000000000,
      "%": 0.01,
    }
    return multipliers[string] ? multipliers[string] : 1
  }

  const el = select(n[i])
  const text = el.text()
  const newNum = text.replace(/([a-zA-Z%,])/g, "")
  const index = interpolateNumber(newNum, value)

  return function(t) {
    el.text(format(numberFormat)(index(t)))
  }
}

export function createUpdateNumberText({
  duration,
  textDy,
  xScale,
  yScale,
  data,
  xKey,
  yKey,
  ref,
  numberFormat,
  prefix,
  suffix,
  isHidden
}) {
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
          .attr("dy", textDy)
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
              .tween("text", (d, i, n) =>
                numberTween({
                  value: d[yKey],
                  i,
                  n,
                  numberFormat,
                  prefix,
                  suffix,
                })
              )
          ),
      update =>
        update.call(update =>
          update
            .transition()
            .duration(duration)
            .ease(easeCubicInOut)
            .attr("x", d => xScale(d[xKey]) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d[yKey]))
            .tween("text", (d, i, n) =>
              numberTween({
                value: d[yKey],
                i,
                n,
                numberFormat,
                prefix,
                suffix,
              })
            )
        )
    )
}
