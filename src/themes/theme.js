
export const space = [0, 4, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96]

export const colors = {
  white: "#ffffff",
  whiteDark: "#E5E5E5",
  grayLightest: "#cccccc",
  grayLighter: "#B2B2B2",
  grayLight: "#999999",
  gray: "#7F7F7F",
  grayDark: "#666666",
  grayDarker: "#4C4C4C",
  grayDarkest: "#333333",
  blackLight: "#191919",
  black: "#000000",

  red: "#bc5148"
}

export const ease = {
  easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1)",
}

export const transition = {
  xs: "150ms",
  xsNum: 150,
  sm: "300ms",
  smNum: 300,
  md: "500ms",
  mdNum: 500,
}

export const fontSize = [
  "1rem",
  "1.5rem",
  "2rem",
  "3rem",
  "4rem",
  "5rem",
  "6rem",
  "7rem",
  "8rem",
  "9rem",
  "10rem",
  "11rem",
  "12rem",
]

export const fontWeight = {
  ultralight: 200, 
  light: 300, 
  book: 400, 
  medium: 500, 
  semiBold: 600, 
  bold: 700, 
  heavy: 800
}

export const z = {
  tooltip: 50,
  loader: 100,
  overlay: 120
}

const theme = {
  space,
  fontSize,
  fontWeight,
  colors,
  ease,
  transition,
  z,
}

export default theme
