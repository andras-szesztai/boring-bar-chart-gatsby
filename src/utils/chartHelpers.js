import _ from 'lodash'
import { extent } from 'd3-array'

export function checkIfUpdated(sortedRaw, sortedPrevRaw) {
  return sortedRaw
    .map((el, i) => _.isEqual(el, sortedPrevRaw[i]))
    .includes(false);
}

export function getAxisPadding(data, key, domainPaddingValue = 0.025){
  const minmax = extent(data, d => d[key]);
  const minmaxDiff = minmax[1] - minmax[0];
  const domainPadding = minmaxDiff * domainPaddingValue;
  return domainPadding;
};