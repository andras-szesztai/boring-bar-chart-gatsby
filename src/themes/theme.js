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
  red: "#bc5148",

  tealBlueLightest: "#B7F6F7",
  tealBlueLighter: "#AFECED",
  tealBlueLight: "#A0D7D8",
  tealBlue: "#8bbabb",
  tealBlueDark: "#7AA5A5",
  tealBlueDarker: "#678C8C",
  tealBlueDarkest: "#4E6A6A ",
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
  lg: "1000ms",
  lgNum: 1000,
}

export const fontFamily = "gill-sans-nova, sans-serif !important"

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
  ultraLight: 200,
  light: 300,
  book: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  heavy: 800,
}

export const z = {
  hoverOverlay: 10,
  tooltip: 50,
  dropdown: 60,
  loader: 100,
  overlay: 120,
  modal: 130,
  subSuper: 9998,
  super: 9999,
}

export const dropShadow = {
  primary: "0 1px 3px rgba(51,51,51,0.12)",
  secondary: "0 1px 2px rgba(51,51,51,0.24)",
}

export const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    zIndex: z.modal,
    cursor: "pointer",
  },
}

const theme = {
  space,
  fontSize,
  fontWeight,
  colors,
  ease,
  transition,
  z,
  dropShadow,
}

export default theme
