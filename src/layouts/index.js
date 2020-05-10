import React, { useState } from "react"
import styled from "styled-components"
import { isMobileOnly } from "react-device-detect"
import { Link } from "gatsby"
import { motion } from "framer-motion"
import { GoTriangleDown } from "react-icons/go"

import { FlexContainer, Container } from "../components/atoms"
import { dropShadow, space, z } from "../themes/theme"
import {
  themifyColor,
  themifyFontSize,
  themifyFontWeight,
} from "../themes/mixins"
import { IconChart } from "../components/molecules"
import SOCIAL_LINKS from "../constants/social-links"

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

  a {
    text-decoration: none;
  }
`

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  filter: drop-shadow(${dropShadow.primary});
`

const LinkContainer = styled(motion.div)`
  margin-left: ${space[4]}px;
  text-decoration: none;
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
    margin-top: 2px;
  }
`

const HoverTriangleContainer = styled(motion.div)`
  position: fixed;
  top: 51px;
  z-index: ${z["subSuper"]};
`

const SelectedTriangleContainer = styled(motion.div)`
  position: fixed;
  top: 51px;
  z-index: ${z["super"]};
`

const LINKS = [
  { text: "Portfolio", path: "/" },
  { text: "Blog", path: "/blog" },
]

export default function Layout({ children, pageContext }) {
  const isVisualization = pageContext.layout === "visualizations"
  const [hoveredObject, setHoveredObject] = useState({
    bottom: 50,
    height: 40,
    left: 112,
    right: 209.21875,
    top: 10,
    width: 97.21875,
    x: 112,
    y: 10,
  })
  const [activeObject, setActiveObject] = useState({
    bottom: 50,
    height: 40,
    left: 112,
    right: 209.21875,
    top: 10,
    width: 97.21875,
    x: 112,
    y: 10,
  })

  return (
    <>
      {!isVisualization && (
        <>
          <SelectedTriangleContainer
            initial={{
              x: activeObject.x + activeObject.width / 2 - 15,
              opacity: 1,
            }}
            animate={{
              x: activeObject.x + activeObject.width / 2 - 15,
            }}
          >
            <GoTriangleDown size={30} color="#333" />
          </SelectedTriangleContainer>
          <HoverTriangleContainer
            initial={{
              opacity: 0,
              x: hoveredObject.x + hoveredObject.width / 2 - 15,
            }}
            animate={{
              x: hoveredObject.x + hoveredObject.width / 2 - 15,
              opacity: 0.25,
            }}
          >
            <GoTriangleDown size={30} color="#333" />
          </HoverTriangleContainer>
          <HeaderContainer>
            <LinksContainer>
              <IconContainer style={{ cursor: "pointer" }}>
                <IconChart dims={40} />
              </IconContainer>
              {LINKS.map(link => (
                <Link to={link.path}>
                  <LinkContainer
                    onHoverStart={event => {
                      const currHovered = event.path[0].getBoundingClientRect()
                      if (hoveredObject !== currHovered)
                        setHoveredObject(currHovered)
                    }}
                    onClick={() => setActiveObject(hoveredObject)}
                  >
                    <Link to={link.path}>{link.text}</Link>
                  </LinkContainer>
                </Link>
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
      {children}
    </>
  )
}
