import React, { useState } from "react"
import styled from "styled-components"
import { isMobileOnly } from "react-device-detect"
import { Link } from "gatsby"
import PageTransition from "gatsby-plugin-page-transitions"
import { motion, AnimatePresence } from "framer-motion"
import { BsFillTriangleFill } from "react-icons/bs"

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

const LinkContainer = styled(motion.div)`
  margin-left: ${space[4]}px;

  display: flex;
  align-items: center;

  padding: 0 10px;

  a {
    color: ${themifyColor("grayDarkest")};
    text-decoration: none;
    font-size: ${themifyFontSize(3)};
    font-weight: ${themifyFontWeight(0)};
    color: #333;
    border-radius: 2px;
    line-height: 1.25;
  }
`

const HoverTriangleContainer = styled(motion.div)`
  position: fixed;
  top: 55px;
`

const LINKS = [
  { text: "Portfolio", path: "/" },
  { text: "Blog", path: "/blog" },
]

export default function Header({ children, pageContext, location }) {
  const isVisualization = pageContext.layout === "visualizations"
  const [hoveredObject, setHoveredObject] = useState(undefined)

  console.log(hoveredObject)

  return (
    <>
      {!isVisualization && (
        <>
          <AnimatePresence>
            <HoverTriangleContainer
              initial={{ rotate: 180 }}
              animate={{
                x: hoveredObject
                  ? hoveredObject.x + hoveredObject.width / 2 - 15
                  : 0,
              }}
            >
              <BsFillTriangleFill size={30} color="#333" />
            </HoverTriangleContainer>
          </AnimatePresence>
          <HeaderContainer>
            <LinksContainer>
              <IconContainer style={{ cursor: "pointer" }}>
                <IconChart dims={40} />
              </IconContainer>

              {LINKS.map(link => (
                <LinkContainer
                  onHoverStart={event => {
                    const currHovered = event.path[0].getBoundingClientRect()
                    if (hoveredObject !== currHovered)
                      setHoveredObject(currHovered)
                  }}
                >
                  <Link to={link.path}>{link.text}</Link>
                </LinkContainer>
              ))}
            </LinksContainer>
            <FlexContainer cursor="pointer">
              {SOCIAL_LINKS.map(
                ({ link, component: Component, componentProps }) => (
                  <Container
                    key={link}
                    marginLeft={isMobileOnly ? 3 : 4}
                    paddingTop={1}
                  >
                    <a
                      href={`${link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Component {...componentProps} />
                    </a>
                  </Container>
                )
              )}
            </FlexContainer>
          </HeaderContainer>
        </>
      )}
      <PageTransition>{children}</PageTransition>
    </>
  )
}
