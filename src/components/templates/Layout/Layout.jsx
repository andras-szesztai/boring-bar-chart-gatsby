import React from "react"
import styled from "styled-components"
import { isMobileOnly, withOrientationChange } from "react-device-detect"

import { useWindowDimensions } from "../../../hooks"
import { GridContainer } from "../../atoms"
import { Header } from "../../organisms"

const LayoutContainer = styled(GridContainer)`
  grid-template-rows: 60px 1fr;
  grid-row-gap: 0;
  height: ${({ height }) => height + "px" || "100vh"};
  padding-bottom: 2rem;
`

function Layout({ isPortrait, children }) {
  const { windowHeight, windowWidth } = useWindowDimensions()
  return (
    <LayoutContainer
      height={isMobileOnly && (isPortrait ? windowHeight : windowWidth)}
    >
      <Header/>
      {children}
    </LayoutContainer>
  )
}

export default withOrientationChange(Layout)
