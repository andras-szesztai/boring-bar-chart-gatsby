import React from "react"
import ThemeProvider from "./src/themes/ThemeProvider"
import "./src/styles/main.css"
export const wrapRootElement = ({ element }) => {
  return <ThemeProvider>{element}</ThemeProvider>
}
