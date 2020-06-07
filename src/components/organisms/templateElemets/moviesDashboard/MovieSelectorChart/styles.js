import styled from "styled-components"
import { motion } from "framer-motion"

import { HANDLE_SIZE } from "../../../../../constants/moviesDashboard"

export const MainContainer = styled(motion.div)`
  width: 100vw;
  height: 100vh;
  position: absolute;

  display: flex;
  justify-content: center;
  align-items: center;

  user-select: none;
`

export const SubContainer = styled.div`
  display: grid;
  width: calc(100% - (2 * ${HANDLE_SIZE}px));
  height: 80%;

  grid-template-rows: 60px auto;
`

export const ChartContainer = styled.div`
  display: grid;

  grid-template-rows: ${({ twoCharts }) =>
    twoCharts ? "1fr 50px 1fr" : "1fr 50px"};
`
