import React from "react"
import ThemeProvider from "./src/theme/ThemeProvider"
import "./src/styles/main.css"
export const wrapRootElement = ({ element }) => {
  return <ThemeProvider>{element}</ThemeProvider>
}
