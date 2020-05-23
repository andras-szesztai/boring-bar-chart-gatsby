import styled from "styled-components"
import { motion } from "framer-motion"
import { space, colors, dropShadow } from "../../../../../themes/theme"

export const ControlCollapsed = styled(motion.div)`
  width: 200px;
  height: 80px;
  z-index: 10;

  display: flex;
  align-items: center;

  position: fixed;
  left: ${space[2]}px;
  bottom: ${space[2]}px;

  border-radius: ${space[1]}px 0 0 ${space[1]}px;
  filter: drop-shadow(${dropShadow.primary});
  box-shadow: 1px 0px 3px 0 rgba(51,51,51,0.12);
  border: 1px solid ${colors.whiteDark};
`

export const EndIconsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  z-index: 10;
  height: 80px;
  width: 35px;

  position: fixed;
  bottom: ${space[2]}px;
  background-color: #fff;

  filter: drop-shadow(${dropShadow.primary});
  box-shadow: -1px 0px 3px 0 rgba(51,51,51,0.12);
  border: 1px solid ${colors.whiteDark};
  border-radius: 0 ${space[1]}px ${space[1]}px 0;
`

export const RecentListContainer = styled(motion.div)`
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
  max-width: calc(100vw - 2 * ${space[2]}px - 200px - 45px);
  z-index: 0;
`

export const DisplayRecentListContainer = styled(RecentListContainer)`
  z-index: 1;
  height: 70px;
  bottom: ${space[2] + 5}px;
`
