import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { isMobileOnly } from "react-device-detect"
import { Link } from "gatsby"
import { motion, AnimatePresence } from "framer-motion"
import { GoTriangleDown } from "react-icons/go"
import _ from "lodash"

import { FlexContainer } from "../components/atoms"
import { dropShadow, space, z } from "../themes/theme"
import {
  themifyColor,
  themifyFontSize,
  themifyFontWeight,
} from "../themes/mixins"
import { IconChart } from "../components/molecules"
import SOCIAL_LINKS from "../constants/social-links"
import { useArrayRefs } from "../hooks"

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

export default function Layout({ children, pageContext, location }) {
  const isVisualization = pageContext.layout === "visualizations"
  const [activeObject, setActiveObject] = useState(undefined)
  const [hoveredObject, setHoveredObject] = useState(undefined)

  const linkNavRefs = useArrayRefs(LINKS.length)

  useEffect(() => {
    if (!activeObject && location) {
      const currentActive = LINKS.findIndex(
        ({ path }) => location.pathname === path
      )
      const currObjectBound = linkNavRefs.current[
        currentActive
      ].current.getBoundingClientRect()
      setActiveObject(currObjectBound)
      setHoveredObject(currObjectBound)
    }
  }, [activeObject, location, linkNavRefs])

  return (
    <>
      {!isVisualization && (
        <>
          <AnimatePresence>
            {activeObject && (
              <SelectedTriangleContainer
                initial={{
                  x: activeObject.x + activeObject.width / 2 - 15,
                  opacity: 0,
                }}
                animate={{
                  x: activeObject.x + activeObject.width / 2 - 15,
                  opacity: 1,
                }}
              >
                <GoTriangleDown size={30} color="#333" />
              </SelectedTriangleContainer>
            )}
          </AnimatePresence>
          {hoveredObject && (
            <HoverTriangleContainer
              initial={{
                x: hoveredObject.x + hoveredObject.width / 2 - 15,
                opacity: 0,
              }}
              animate={{
                x: hoveredObject.x + hoveredObject.width / 2 - 15,
                opacity: 0.25,
              }}
            >
              <GoTriangleDown size={30} color="#333" />
            </HoverTriangleContainer>
          )}
          <HeaderContainer>
            <LinksContainer>
              <IconContainer style={{ cursor: "pointer" }}>
                <IconChart dims={40} />
              </IconContainer>
              {LINKS.map((link, i) => (
                <Link to={link.path}>
                  <LinkContainer
                    ref={linkNavRefs.current[i]}
                    onHoverStart={event => {
                      const currHovered = event.path[0].getBoundingClientRect()
                      if (!_.isEqual(hoveredObject, currHovered))
                        setHoveredObject(currHovered)
                    }}
                    onTap={() => {
                      if (!_.isEqual(activeObject, hoveredObject))
                        setActiveObject(hoveredObject)
                    }}
                  >
                    <Link to={link.path}>{link.text}</Link>
                  </LinkContainer>
                </Link>
              ))}
            </LinksContainer>
            <FlexContainer>
              {SOCIAL_LINKS.map(
                ({ link, component: Component, componentProps }) => (
                  <motion.div
                    key={link}
                    whileHover={{ scale: 1.3 }}
                    style={{
                      marginLeft: isMobileOnly ? space[3] : space[4],
                      paddingTop: space[1],
                      cursor: "pointer",
                    }}
                  >
                    <a
                      href={`${link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Component {...componentProps} />
                    </a>
                  </motion.div>
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
