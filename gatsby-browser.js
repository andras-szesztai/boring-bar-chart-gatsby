import React from "react"
import ThemeProvider from "./src/theme/ThemeProvider"
export const wrapRootElement = ({ element }) => {
  return <ThemeProvider>{element}</ThemeProvider>
}
