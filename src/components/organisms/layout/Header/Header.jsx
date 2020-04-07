import React from "react"
import styled from "styled-components"
import { isMobileOnly } from "react-device-detect"

import { FlexContainer, Container } from "../../../atoms"
import { IconChart } from "../../../molecules"
import SOCIAL_LINKS from "../../../../constants/social-links"

const HeaderContainer = styled(FlexContainer)`
  position: fixed;
  width: 100vw;
  height: 60px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  background-color: #fff;
  z-index: 1000;
  padding: 3rem 3rem;

  @media (min-width: 700px) {
    padding: 3rem 4rem;
  }
  @media (min-width: 1400px) {
    padding: 3rem 6rem;
  }
`

export default function Header() {
  return (
    <HeaderContainer justify="space-between">
      <FlexContainer cursor="pointer">
        <IconChart dims={40} />
      </FlexContainer>
      <FlexContainer cursor="pointer">
        {SOCIAL_LINKS.map(({ link, component: Component, componentProps }) => (
          <Container marginLeft={isMobileOnly ? 3 : 4} paddingTop={1}>
            <a href={`${link}`} target="_blank" rel="noopener noreferrer">
              <Component {...componentProps} />
            </a>
          </Container>
        ))}
      </FlexContainer>
    </HeaderContainer>
  )
}
