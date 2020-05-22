import styled from "styled-components"
import { motion } from "framer-motion"
import { space, colors } from "../../../../../themes/theme"

export const ControlCollapsed = styled(motion.div)`
  width: 200px;
  padding: ${space[2]}px ${space[3]}px;
  box-shadow: 1px 0px 4px 0px rgba(51, 51, 51, 0.24);

  display: grid;
  grid-template-rows: repeat(2, 1fr);
  z-index: 10;
`

export const EndIconsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: -1px 0px 4px 0px rgba(51, 51, 51, 0.24);

  z-index: 10;
  height: 100%;
`

export const RecentListContainer = styled(motion.div)`
  display: flex;
  justify-content: flex-start;
  padding-right: ${space[6]}px;
  background: ${colors.whiteDark};

  z-index: 1;
  overflow-x: auto;
`
