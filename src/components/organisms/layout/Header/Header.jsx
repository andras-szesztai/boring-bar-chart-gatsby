import React, { useEffect } from "react"
import styled from "styled-components"
import { isMobileOnly } from "react-device-detect"
import { Link } from "gatsby"

import { FlexContainer, Container } from "../../../atoms"
import { IconChart } from "../../../molecules"
import SOCIAL_LINKS from "../../../../constants/social-links"
import { space, dropShadow } from "../../../../themes/theme"
import {
  themifyColor,
  themifyFontSize,
  themifyFontWeight,
} from "../../../../themes/mixins"

const LinksContainer = styled.div`
  display: flex;
`

const HeaderContainer = styled(FlexContainer)`
  position: fixed;
  width: 100vw;
  height: 60px;
  filter: drop-shadow(${dropShadow.primary});
  background-color: #fff;
  z-index: 1000;
  padding: 3rem 3rem;

  justify-content: space-between;
  align-items: center;

  @media (min-width: 700px) {
    padding: 3rem 4rem;
  }
  @media (min-width: 1400px) {
    padding: 3rem 6rem;
  }
`

const IconContainer = styled.div`
  display: flex;
  align-items: center;
`

const LinkContainer = styled.div`
  margin-left: ${space[4]}px;

  display: flex;
  align-items: center;

  padding: 0 10px;

  a {
    position: relative;
    color: ${themifyColor("grayDarkest")};
    text-decoration: none;
    font-size: ${themifyFontSize(3)};
    font-weight: ${themifyFontWeight(0)};
    color: #333;
    border-radius: 2px;
    line-height: 1.25;

    :after {
      top: 150%;
      left: 50%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-color: rgba(136, 183, 213, 0);
      border-top-color: #333;
      border-width: 10px;
      margin-left: -10px;
    }
  }
`

export default function Header({ children, pageContext }) {
  console.log(pageContext)
  return (
    <>
      <HeaderContainer>
        <LinksContainer>
          <IconContainer style={{ cursor: "pointer" }}>
            <IconChart dims={40} />
          </IconContainer>
          <LinkContainer isActive={true}>
            <Link to="/">Home</Link>
          </LinkContainer>
          <LinkContainer isActive={true}>
            <Link to="/blog/posts">Blog</Link>
          </LinkContainer>
        </LinksContainer>
        <FlexContainer cursor="pointer">
          {SOCIAL_LINKS.map(
            ({ link, component: Component, componentProps }) => (
              <Container
                key={link}
                marginLeft={isMobileOnly ? 3 : 4}
                paddingTop={1}
              >
                <a href={`${link}`} target="_blank" rel="noopener noreferrer">
                  <Component {...componentProps} />
                </a>
              </Container>
            )
          )}
        </FlexContainer>
      </HeaderContainer>
      {children}
    </>
  )
}
