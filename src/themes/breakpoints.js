import { css } from 'styled-components';

export const breakpointsPx = {
  xxs: 425,
  xs: 768,
  sm: 1024,
  md: 1280,
  lg: 1366,
  xl: 1440,
  xxl: 1900
};

export const mediaMax = Object.keys(breakpointsPx).reduce((breakpoints, size) => {
  breakpoints[size] = (...rules) => css`
    @media (max-width: calc(${breakpointsPx[size] / 16}em - 1px)) {
      ${css(...rules)}
    }
  `;
  return breakpoints;
}, {});

export const mediaMin = Object.keys(breakpointsPx).reduce((breakpoints, size) => {
  breakpoints[size] = (...rules) => css`
    @media (min-width: ${breakpointsPx[size] / 16}em) {
      ${css(...rules)};
    }
  `;
  return breakpoints;
}, {});

// returns sizes object in ems
export const breakpointsEm = Object.keys(breakpointsPx).reduce((breakpoints, size) => {
  breakpoints[size] = `${breakpointsPx[size] / 16}`;
  return breakpoints;
}, {});

export const breakpointsArray = Object.keys(breakpointsPx).map(size => breakpointsEm[size]);

export const mediaQueries = Object.keys(breakpointsEm).reduce((breakpoints, size, index) => {
  breakpoints[size] = `@media screen${
    breakpointsArray[index] > 0 ? ` and (min-width: ${breakpointsArray[index]}em)` : ''
  }${
    breakpointsArray[index + 1]
      ? ` and (max-width: calc(${breakpointsArray[index + 1]}em - 1px))`
      : ''
  }`;
  return breakpoints;
}, {});

export default mediaMin;