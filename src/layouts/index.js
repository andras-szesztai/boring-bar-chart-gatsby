import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { withOrientationChange } from "react-device-detect"
import { isMobileOnly } from "react-device-detect"
import { motion, AnimatePresence } from "framer-motion"
import { GoTriangleDown, GoTriangleUp } from "react-icons/go"
import { useMove } from "react-use-gesture"

import { FlexContainer } from "../components/atoms"
import { dropShadow, space, z, colors } from "../themes/theme"
import { IconChart } from "../components/molecules"
import SOCIAL_LINKS from "../constants/social-links"
import {
  useArrayRefs,
  usePrevious,
  useDeviceType,
  useDeviceOrientation,
} from "../hooks"
import NavigationLinks from "./NavigationLinks/NavigationLinks"
import { themifyColor } from "../themes/mixins"

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

const FooterContainer = styled(FlexContainer)`
  position: fixed;
  width: 100vw;
  height: 60px;
  bottom: 0px;
  right: 0px;
  background-color: ${themifyColor("grayDarkest")};
  z-index: 1000;
  padding: 3rem 3rem;

  justify-content: space-evenly;
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

const SelectedBottomTiangleContainer = styled(motion.div)`
  position: fixed;
  bottom: 48px;
`

const NAV_LINKS = [
  { text: "Portfolio", path: "/", marginLeft: space[3] },
  { text: "Blog", path: "/blog", marginLeft: space[2] },
]

function Layout({ children, pageContext, location, isPortrait }) {
  const isVisualization = pageContext.layout === "visualizations"
  const prevLocation = usePrevious(location)

  const callSetHoveredNav = currHovered =>
    setHoveredNav(currHovered.x + currHovered.width / 2 - 5)

  const device = useDeviceType()
  const orientation = useDeviceOrientation(isPortrait)

  const isMobilePortrait = device === "mobile" && orientation === "portrait"
  const isNotMobilePortrait =
    orientation === "landscape" ||
    (orientation === "portrait" && device !== "mobile")

  const [activeNav, setActiveNav] = useState(undefined)
  const [hoveredNav, setHoveredNav] = useState(undefined)
  const [isHeaderHovered, setIsHeaderHovered] = useState(false)
  const [isIconChartHovered, setIsIconChartHovered] = useState(false)
  const [isLinkHovered, setIsLinkHovered] = useState(false)
  const [isInactiveLinkHovered, setIsInactiveLinkHovered] = useState(false)

  const linkNavRefs = useArrayRefs(NAV_LINKS.length)

  // TODO: fix when resized
  useEffect(() => {
    if (!isVisualization) {
      const currentActive = NAV_LINKS.findIndex(
        ({ path }) => location.pathname === path
      )
      const currNavElement = linkNavRefs.current[currentActive].current
      if (!activeNav && location && currNavElement) {
        const currObjectBound = currNavElement.getBoundingClientRect()
        setActiveNav(currObjectBound)
        !isMobilePortrait && callSetHoveredNav(currObjectBound)
      }
      if (location !== prevLocation && currNavElement) {
        const currObjectBound = currNavElement.getBoundingClientRect()
        setActiveNav(currObjectBound)
        if (!isMobilePortrait) {
          callSetHoveredNav(currObjectBound)
          setIsInactiveLinkHovered(false)
        }
      }
    }
  }, [
    activeNav,
    location,
    linkNavRefs,
    prevLocation,
    isVisualization,
    isNotMobilePortrait,
    isMobilePortrait,
  ])

  const bind = useMove(({ xy }) => {
    !isIconChartHovered &&
      !isLinkHovered &&
      isHeaderHovered &&
      setHoveredNav(xy[0])
  })

  const setActiveHover = event => {
    const currHovered = event.path[0].getBoundingClientRect()
    callSetHoveredNav(currHovered)
  }

  const navigationLinksProps = {
    linkNavRefs,
    links: NAV_LINKS,
    setActiveHover,
    setIsLinkHovered,
    setIsInactiveLinkHovered,
    location,
  }

  return (
    <>
      {!isVisualization && (
        <>
          {isNotMobilePortrait && (
            <>
              <AnimatePresence>
                {activeNav && (
                  <SelectedTriangleContainer
                    initial={{
                      x: activeNav.x + activeNav.width / 2 - 15,
                      opacity: 0,
                    }}
                    animate={{
                      x: activeNav.x + activeNav.width / 2 - 15,
                      opacity: 1,
                    }}
                  >
                    <GoTriangleDown size={30} color={colors.grayDarkest} />
                  </SelectedTriangleContainer>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {!!hoveredNav && !isIconChartHovered && (
                  <HoverTriangleContainer
                    initial={{
                      x: hoveredNav - 10,
                      opacity: 0,
                      color: colors.grayDarkest,
                    }}
                    animate={{
                      x: hoveredNav - 10,
                      opacity: isLinkHovered ? 0.7 : 0.2,
                      scale: isInactiveLinkHovered ? 1.3 : 1,
                      y: isInactiveLinkHovered ? 2 : 0,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                  >
                    <GoTriangleDown size={30} />
                  </HoverTriangleContainer>
                )}
              </AnimatePresence>
            </>
          )}
          <HeaderContainer
            {...bind()}
            onMouseEnter={() => {
              setIsHeaderHovered(true)
            }}
            onMouseLeave={() => {
              setIsHeaderHovered(false)
              setHoveredNav(activeNav.x + activeNav.width / 2 - 5)
            }}
          >
            <LinksContainer>
              <IconContainer
                onHoverStart={event => {
                  setActiveHover(event)
                  setIsIconChartHovered(true)
                }}
                onMouseLeave={() => {
                  setIsIconChartHovered(false)
                }}
              >
                <IconChart dims={40} />
              </IconContainer>
              {isNotMobilePortrait && (
                <NavigationLinks {...navigationLinksProps} />
              )}
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
                      setActiveHover(event)
                      setIsIconChartHovered(true)
                    }}
                    onMouseLeave={() => {
                      setIsIconChartHovered(false)
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
      {isMobilePortrait && (
        <FooterContainer>
          <NavigationLinks
            {...navigationLinksProps}
            anchorColor="#fff"
            isBottom
          />
        </FooterContainer>
      )}
      {isMobilePortrait && (
        <SelectedBottomTiangleContainer
          initial={{
            x: activeNav.x + activeNav.width / 2 - 15,
          }}
          animate={{
            x: activeNav.x + activeNav.width / 2 - 15,
          }}
        >
          <GoTriangleUp size={30} color={colors.grayDarkest} />
        </SelectedBottomTiangleContainer>
      )}
    </>
  )
}

export default withOrientationChange(Layout)
