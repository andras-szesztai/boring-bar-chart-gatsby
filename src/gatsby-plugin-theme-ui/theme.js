import shadesOfPurple from "@theme-ui/prism/presets/shades-of-purple.json"

export default {
  colors: {
    text: "#000",
    background: "#fff",
    primary: "#07c",
  },
  fonts: {
    body: "gill-sans-nova, sans-serif",
    heading: "gill-sans-nova, sans-serif",
  },
  fontWeights: {
    body: 400,
    heading: 700,
  },
  styles: {
    h1: {
      fontSize: 20,
      fontFamily: "heading",
      fontWeight: "heading",
      color: "primary",
      mt: 4,
      mb: 2,
    },
    code: {
      ...shadesOfPurple,
    },
  },
}
