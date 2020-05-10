import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { isMobileOnly } from "react-device-detect"
import { Link } from "gatsby"
import { motion, AnimatePresence } from "framer-motion"
import { GoTriangleDown } from "react-icons/go"
import _ from "lodash"
import { useMove } from "react-use-gesture"

import { FlexContainer } from "../components/atoms"
import { dropShadow, space, z } from "../themes/theme"
import {
  themifyColor,
  themifyFontSize,
  themifyFontWeight,
} from "../themes/mixins"
import { IconChart } from "../components/molecules"
import SOCIAL_LINKS from "../constants/social-links"
import { useArrayRefs, usePrevious } from "../hooks"

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

const IconContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  filter: drop-shadow(${dropShadow.primary});
  cursor: pointer;
`

const LinkContainer = styled(motion.div)`
  text-decoration: none;
  display: flex;
  align-items: center;

  position: relative;
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
  { text: "Portfolio", path: "/", marginLeft: space[3] },
  { text: "Blog", path: "/blog", marginLeft: space[2] },
]

export default function Layout({ children, pageContext, location }) {
  const isVisualization = pageContext.layout === "visualizations"

  const [activeObject, setActiveObject] = useState(undefined)
  const [headerIsHovered, setHeaderIsHovered] = useState(false)
  const [isIconChartHovered, setIsIconChartHovered] = useState(false)
  const [isLinkHovered, setIsLinkHovered] = useState(false)
  const [hoverX, setHoverX] = useState(undefined)
  const prevLocation = usePrevious(location)

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
      setHoverX(currObjectBound.x + currObjectBound.width / 2 - 5)
    }
    if (location !== prevLocation) {
      const currentActive = LINKS.findIndex(
        ({ path }) => location.pathname === path
      )
      const currObjectBound = linkNavRefs.current[
        currentActive
      ].current.getBoundingClientRect()
      if (!_.isEqual(currObjectBound, activeObject))
        setActiveObject(currObjectBound)
      setHoverX(currObjectBound.x + currObjectBound.width / 2 - 5)
    }
  }, [activeObject, location, linkNavRefs, prevLocation])

  const bind = useMove(({ xy }) => {
    !isIconChartHovered && !isLinkHovered && headerIsHovered && setHoverX(xy[0])
  })

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
          <AnimatePresence>
            {!!hoverX && !isIconChartHovered && (
              <HoverTriangleContainer
                initial={{
                  x: hoverX - 10,
                  opacity: 0,
                  color: "#333",
                }}
                animate={{
                  x: hoverX - 10,
                  opacity: isLinkHovered ? 0.7 : 0.2,
                }}
                exit={{
                  opacity: 0,
                }}
              >
                <GoTriangleDown size={30} />
              </HoverTriangleContainer>
            )}
          </AnimatePresence>
          <HeaderContainer
            {...bind()}
            onMouseEnter={() => {
              setHeaderIsHovered(true)
            }}
            onMouseLeave={() => {
              setHeaderIsHovered(false)
              setHoverX(activeObject.x + activeObject.width / 2 - 5)
            }}
          >
            <LinksContainer>
              <IconContainer
                onHoverStart={event => {
                  const currHovered = event.path[0].getBoundingClientRect()
                  setHoverX(currHovered.x + currHovered.width / 2 - 5)
                  setIsIconChartHovered(true)
                }}
                onMouseLeave={() => {
                  setIsIconChartHovered(false)
                }}
                style={{ cursor: "pointer" }}
              >
                <IconChart dims={40} />
              </IconContainer>
              {LINKS.map((link, i) => (
                <Link to={link.path} style={{ cursor: "auto" }}>
                  <LinkContainer
                    ref={linkNavRefs.current[i]}
                    role="button"
                    onHoverStart={event => {
                      const currHovered = event.path[0].getBoundingClientRect()
                      setIsLinkHovered(true)
                      setHoverX(currHovered.x + currHovered.width / 2 - 5)
                    }}
                    onMouseLeave={() => {
                      setIsLinkHovered(false)
                    }}
                    style={{
                      marginLeft: link.marginLeft,
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
                    onHoverStart={event => {
                      const currHovered = event.path[0].getBoundingClientRect()
                      setIsLinkHovered(true)
                      setHoverX(currHovered.x + currHovered.width / 2 - 5)
                    }}
                    onMouseLeave={() => {
                      setIsLinkHovered(false)
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
