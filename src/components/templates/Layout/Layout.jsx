import React from "react"
import styled from "styled-components"
import { isMobileOnly } from "react-device-detect"

import { useWindowDimensions } from "../../../hooks"
import { GridContainer } from "../../atoms"
import { Header } from "../../organisms"

const LayoutContainer = styled(GridContainer)`
  grid-template-rows: 60px 1fr;
  grid-row-gap: 0;
  height: ${({ height }) => height ? height + "px" : "100vh"};
  padding-bottom: 2rem;
`

function Layout({ children }) {
  const { windowHeight } = useWindowDimensions()
  return (
    <LayoutContainer height={isMobileOnly ? windowHeight : undefined}>
      <Header />
      {children}
    </LayoutContainer>
  )
}

export default Layout
