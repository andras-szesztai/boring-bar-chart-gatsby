import React from "react"
import styled, { css } from "styled-components"
import chroma from "chroma-js"

import {
  themifyColor,
  themifyTransition,
  themifyFontSize,
  themifyFontWeight,
} from "../../../themes/mixins"

const Link = styled.a`
  text-decoration: none;
  transition: color ${themifyTransition("sm")};
  ${({ color, fontsize, fontWeight }) => css`
    color: ${themifyColor("grayDarkest")};
    font-size: ${themifyFontSize(fontsize)};
    font-weight: ${themifyFontWeight(fontWeight)};
    :hover {
      color: ${chroma(themifyColor(color)).brighten(2)};
      text-decoration: underline;
    }
  `}
`

function LinkAnchor(props) {
  return (
    <Link {...props} target="_blank" rel="noopener noreferrer">
      {props.children}
    </Link>
  )
}

LinkAnchor.defaultProps = {
  color: "grayDarkest",
  fontsize: 1,
  fontWeight: "medium",
}

export default LinkAnchor
