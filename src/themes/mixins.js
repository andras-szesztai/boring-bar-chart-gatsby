import theme from "./theme"

function createThemify(path) {
  return function Themify(el) {
    return path[el]
  }
}

export function themifyColor(color = "transparent") {
  if(theme.colors[color]){
    return theme.colors[color]
  }
  return color
}

export function themifyFontWeight(weight) {
  if (typeof weight === "number") {
    const weights = Object.values(theme.fontWeight)
    return weights[weight]
  }
  return theme.fontWeight[weight]
}

export const themifyFontSize = createThemify(theme.fontSize) // Pass in index
export const themifyEase = createThemify(theme.ease) // Pass in ease name
export const themifyTransition = createThemify(theme.transition) // Pass in ease name
export const themifySpace = createThemify(theme.space) // Pass in index
export const themifyZIndex = createThemify(theme.z) // Pass in z-index name
