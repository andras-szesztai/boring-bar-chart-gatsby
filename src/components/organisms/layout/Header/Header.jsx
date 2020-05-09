import React from "react"
import styled from "styled-components"
import { isMobileOnly } from "react-device-detect"
import { Link } from "gatsby"

import { FlexContainer, Container } from "../../../atoms"
import { IconChart } from "../../../molecules"
import SOCIAL_LINKS from "../../../../constants/social-links"
import { space } from "../../../../themes/theme"
import { themifyColor, themifyFontSize, themifyFontWeight } from "../../../../themes/mixins"

const LinksContainer = styled.div`
  display: flex;
`

const HeaderContainer = styled(FlexContainer)`
  position: fixed;
  width: 100vw;
  height: 60px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
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
  margin-left: ${space[5]}px;
  
  display: flex;
  align-items: center;

  padding: 0 10px;
  background-color:  #333;
  width: 200px;
  
  a {
    color: ${themifyColor("grayDarkest")};
    text-decoration: none;
    font-size: ${themifyFontSize(3)};
    font-weight: ${themifyFontWeight(0)};

    color: #ffffff;

    border-radius: 2px;
    line-height: 1.25;
  }
`

export default function Header() {
  return (
    <HeaderContainer>
      <LinksContainer>
        <IconContainer style={{ cursor: "pointer" }}>
          <IconChart dims={40} />
        </IconContainer>
        <LinkContainer isActive={true}>
          <Link to="/blog/posts">Blog</Link>
        </LinkContainer>
      </LinksContainer>
      <FlexContainer cursor="pointer">
        {SOCIAL_LINKS.map(({ link, component: Component, componentProps }) => (
          <Container
            key={link}
            marginLeft={isMobileOnly ? 3 : 4}
            paddingTop={1}
          >
            <a href={`${link}`} target="_blank" rel="noopener noreferrer">
              <Component {...componentProps} />
            </a>
          </Container>
        ))}
      </FlexContainer>
    </HeaderContainer>
  )
}
