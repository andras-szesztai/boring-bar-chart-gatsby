import styled, { css } from "styled-components"
import { themifyFontSize } from "../../../../../../themes/mixins"
import { COLORS } from "../../../../../../constants/moviesDashboard"

const fadeOutEffect = css`
  content: "";
  position: absolute;
  z-index: 2;
  left: 0;
  pointer-events: none;
  width: 100%;
  height: 1.5rem;
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

export const LabelContainer = styled.div`
  position: absolute;
  top: 7px;
  left: 0px;
  color: ${COLORS.gridColor};
  font-size: ${themifyFontSize(1)};
  line-height: 1.2;
  width: 50px;
`
