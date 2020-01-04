
import { tint as polishedTint, shade as polishedShade } from 'polished';
import { css } from 'styled-components';
import theme from './theme'

function createThemify(path){
  return function Themify(el){
    return path[el]
  }
}

export function themifyFontWeight(weight){
  const path = theme.type.fontWeight
  const fontWeight = typeof weight === "string"
    ? path[weight]
    : path[Object.keys(path)[weight]]
  return fontWeight
}

export function themifyColor(color){
  if (color.indexOf('#') > -1) {
    return color
  }
  else {
    return theme.colors[color]
  }
}

export const themifyFontSize= createThemify(theme.type.fontSize) // Pass in index
export const themifyCurve= createThemify(theme.curves) // Pass in curve name
export const themifySpace = createThemify(theme.space) // Pass in inde
export const themifyZIndex= createThemify(theme.z) // Pass in z-index name

export function isValidColor(color) {
  var ele = document.createElement('div');
  ele.style.color = color;
  return Boolean(
    ele.style.color
      .split(/\s+/)
      .join('')
      .toLowerCase(),
  );
}

export function themifyShade(amount, color) {
  if (!color || !isValidColor(color)) return;
  if (typeof amount === 'string' && isValidColor(amount)) {
    if (isValidColor(amount)) {
      return polishedShade(1 - color, amount);
    }
    return amount;
  }
  if (isValidColor(color)) {
    return polishedShade(1 - amount, color);
  }
  return color;
}

export function themifyTint(amount, color) {
  if (!color || !isValidColor(color)) return;
  if (typeof amount === 'string') {
    if (isValidColor(amount) && isValidColor(amount)) {
      return polishedTint(1 - color, amount);
    }
    return amount;
  }
  if (isValidColor(color)) {
    return polishedTint(1 - amount, color);
  }
  return color;
}

export function themifyPadding(side, amount) {
  let useEms = false;
  if (typeof side === 'number' || side.indexOf('em') > -1) amount = side;
  if (typeof amount === 'string' && amount.indexOf('em') > -1) {
    amount = amount.split('em')[0];
    useEms = true;
  }
  if (typeof amount !== 'number') return;
  const spacer = '6px';
  if (side === 'top' || side === 't') {
    return css`
      padding-top: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
    `;
  } else if (side === 'right' || side === 'r') {
    return css`
      padding-right: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
    `;
  } else if (side === 'bottom' || side === 'b') {
    return css`
      padding-bottom: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
    `;
  } else if (side === 'left' || side === 'l') {
    return css`
      padding-left: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
    `;
  } else if (side === 'horizontal' || side === 'x') {
    return css`
      padding-left: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
      padding-right: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
    `;
  } else if (side === 'vertical' || side === 'y') {
    return css`
      padding-top: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
      padding-bottom: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
    `;
  } else {
    return css`
      padding: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
    `;
  }
}

export function themifyMargin(side, amount) {
  let useEms = false;
  if (typeof side === 'number' || side.indexOf('em') > -1) amount = side;
  if (typeof amount === 'string' && amount.indexOf('em') > -1) {
    amount = amount.split('em')[0];
    useEms = true;
  }
  if (typeof amount !== 'number') return;
  const spacer = '6px';
  if (side === 'top' || side === 't') {
    return css`
      margin-top: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
    `;
  } else if (side === 'right' || side === 'r') {
    return css`
      margin-right: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
    `;
  } else if (side === 'bottom' || side === 'b') {
    return css`
      margin-bottom: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
    `;
  } else if (side === 'left' || side === 'l') {
    return css`
      margin-left: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
    `;
  } else if (side === 'horizontal' || side === 'x') {
    return css`
      margin-left: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
      margin-right: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
    `;
  } else if (side === 'vertical' || side === 'y') {
    return css`
      margin-top: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
      margin-bottom: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
    `;
  } else {
    return css`
      margin: ${useEms ? `${amount}em` : `calc(${amount} * ${spacer})`};
    `;
  }
}

const mixins = {
  themifyMargin,
  themifyPadding,
  themifyShade,
  themifyTint
};

export default mixins;
