import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

import { motion } from "framer-motion"
import {
  themifyColor,
  themifyFontSize,
  themifyFontWeight,
} from "../../themes/mixins"

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
    color: ${({ anchorColor }) => anchorColor || "#333"};
    border-radius: 2px;
    line-height: 1.25;
    margin-top: ${({ isBottom }) => (isBottom ? 0 : 2)}px;
  }
`

export default function NavigationLinks({
  linkNavRefs,
  links,
  setActiveHover,
  setIsLinkHovered,
  setIsInactiveLinkHovered,
  location,
  anchorColor,
  isBottom,
}) {
  // TODO: check if anchor is working
  return links.map((link, i) => (
    <LinkContainer
      key={link.path}
      ref={linkNavRefs.current[i]}
      role="button"
      onHoverStart={event => {
        setActiveHover(event)
      }}
      onMouseEnter={() => {
        setIsLinkHovered(true)
        setIsInactiveLinkHovered(link.path !== location.pathname)
      }}
      onMouseLeave={() => {
        setIsLinkHovered(false)
        setIsInactiveLinkHovered(false)
      }}
      anchorColor={anchorColor}
      isBottom={isBottom}
      style={{
        marginLeft: !isBottom && link.marginLeft,
      }}
    >
      <Link to={link.path}>{link.text}</Link>
    </LinkContainer>
  ))
}
