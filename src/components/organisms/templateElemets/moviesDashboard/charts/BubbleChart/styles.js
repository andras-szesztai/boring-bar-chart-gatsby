import styled, { css } from "styled-components"
import { motion } from "framer-motion"

import { themifyFontSize } from "../../../../../../themes/mixins"
import { colors } from "../../../../../../themes/theme"

const fadeOutEffect = css`
  content: "";
  position: absolute;
  z-index: 2;
  left: 0;
  pointer-events: none;
  width: 100%;
  height: 2rem;
`

export const Wrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;

  :after {
    ${fadeOutEffect}
    bottom: 0;
    background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1) 95%
    );
  }

  :before {
    ${fadeOutEffect}
    top: 0px;
    background-image: linear-gradient(
      to top,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1) 95%
    );
  }
`

export const ChartSvg = styled.svg`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;
`

export const ChartTitle = styled(motion.div)`
  font-size: ${themifyFontSize(12)};
  line-height: 0.8;
  font-weight: 500;
  text-transform: uppercase;
  color: ${colors.grayDark};
  position: absolute;
  top: 12px;
`

export const NumberContainer = styled(motion.div)`
  font-size: ${themifyFontSize(4)};
  line-height: 0.8;
  font-weight: 500;
  text-transform: uppercase;
  color: ${colors.grayDark};
  opacity: 0.5;
  position: absolute;
  top: 8px;
`