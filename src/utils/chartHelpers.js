import _ from "lodash"
import { extent } from "d3-array"
import { select } from "d3-selection"
import { interpolateNumber } from "d3-interpolate"
import { format } from "d3-format"

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
