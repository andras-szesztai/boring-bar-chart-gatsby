import React from "react"
import styled from "styled-components"

import { GridContainer } from "../../atoms"

const LayoutContainer = styled(GridContainer)`
  grid-row-gap: 0;
  height: auto;
  min-height: 100vh;
  padding-bottom: 2rem;
`

function Layout({ children }) {
  return (
    <LayoutContainer>
      {children}
    </LayoutContainer>
  )
}

export default Layout
