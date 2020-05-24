import chroma from "chroma-js"
import styled from "styled-components"
import { animated } from "react-spring"

import { space, colors, dropShadow } from "../../../../../themes/theme"
import { themifyFontSize } from "../../../../../themes/mixins"
import { COLORS } from "../../../../../constants/moviesDashboard"
import { motion } from "framer-motion"

export const ControlCollapsed = styled(animated.div)`
  width: 200px;
  height: 60px;
  z-index: 10;

  font-size: ${themifyFontSize(2)};
  /* font-weight: 300; */

  display: flex;
  align-items: center;

  position: fixed;
  left: ${space[2]}px;
  bottom: ${space[2]}px;

  border-radius: ${space[1]}px 0 0 ${space[1]}px;
  filter: drop-shadow(${dropShadow.primary});
  background-color: #fff;
  border: 1px solid ${colors.whiteDark};
`

export const EndIconsContainer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  z-index: 10;
  height: 60px;
  width: 35px;

  position: fixed;
  bottom: ${space[2]}px;
  background-color: #fff;

  filter: drop-shadow(${dropShadow.primary});
  border: 1px solid ${colors.whiteDark};
  border-radius: 0 ${space[1]}px ${space[1]}px 0;
`

export const RecentListContainer = styled(animated.div)`
  display: flex;
  justify-content: flex-start;
  background: ${colors.whiteDark};

  overflow-x: auto;

  position: fixed;
  left: calc(${space[2]}px + 200px);
  bottom: ${space[2]}px;
`

export const HiddenRecentListContainer = styled(RecentListContainer)`
  opacity: 0;
  pointer-events: none;
  z-index: 0;

  /* opacity: 1;
  top: 10px;
  height: 80px; */
`

export const DisplayRecentListContainer = styled(RecentListContainer)`
  z-index: 1;
  height: 50px;
  bottom: ${space[2] + 5}px;
  max-width: calc(100vw - 2 * ${space[2]}px - 200px - 35px);

  ::-webkit-scrollbar {
    display: none;
    -ms-overflow-style: none;
  }
`

export const ListItemContainer = styled(animated.div)`
  bottom: 12px;
  font-size: ${themifyFontSize(2)};
  font-weight: 300;
  color: #fff;
  border-radius: ${space[1]}px;
  padding: 2px 16px;
  background-color: ${chroma(COLORS.primary)};
  border: 1px solid ${chroma(COLORS.primary).darken()};

  align-self: center;
  margin-left: ${space[2]}px;
  margin-right: ${({ extramargin }) => (extramargin ? 12 : space[2])}px;

  white-space: nowrap;

  display: flex;
  justify-content: space-between;
`

export const HoveredControlsContainer = styled(motion.div)`
  display: flex;
  justify-content: space-evenly;

  width: 166px;
  margin-left: 14px;
  border-left: 1px solid #fff;
`

export const HoverControlIconContainer = styled(motion.div)`
  position: relative;
  display: flex;

  cursor: pointer;
`
