import styled, { css } from "styled-components"
import { motion } from "framer-motion"
import chroma from "chroma-js"

import { space } from "../../../../../themes/theme"
import { themifyFontSize, themifyColor } from "../../../../../themes/mixins"
import { COLORS } from "../../../../../constants/moviesDashboard"

export const dentedStyling = css`
  box-shadow: inset 1px 1px 5px #c3c3c3, inset -1px -1px 5px #fff;
`

export const TextContainer = styled(motion.div)`
  position: relative;
  margin-top: ${space[1]}px;
  padding: ${space[1]}px ${space[2]}px;
  font-size: ${themifyFontSize(1)};
  justify-self: stretch;
  width: 250px;
  border-radius: 2px;
  font-weight: 200;
  color: ${themifyColor("grayDarker")};
  font-weight: 300;
  overflow-y: auto;
  ${dentedStyling} ::-webkit-scrollbar {
    width: ${space[1]}px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: ${COLORS.backgroundGray};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${({ color }) => color || COLORS.textColor};
    border-radius: 2px;

    :hover {
      background: ${({ color }) => chroma(color || COLORS.textColor).darken()};
    }
  }
`

export const TitleContainer = styled(motion.div)`
  position: relative;
  display: flex;
  font-size: ${themifyFontSize(3)};
  padding-left: 2px;
  font-weight: 500;
  color: ${COLORS.primary};
  cursor: pointer;
`
