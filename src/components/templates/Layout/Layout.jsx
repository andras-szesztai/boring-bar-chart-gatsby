import React from "react"
import styled from "styled-components"

import { GridContainer } from "../../atoms"
import { Header } from "../../organisms"

const LayoutContainer = styled(GridContainer)`
  grid-row-gap: 0;
  height: 100vh;
  padding-bottom: 2rem;
`

function Layout({ children }) {
  return (
    <LayoutContainer>
      <Header />
      {children}
    </LayoutContainer>
  )
}

export default Layout
