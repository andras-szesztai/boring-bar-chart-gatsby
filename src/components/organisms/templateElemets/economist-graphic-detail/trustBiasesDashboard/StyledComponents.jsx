import styled, { css } from "styled-components"

import { themifyFontSize } from "../../../../../themes/mixins"
import { GridContainer, FlexContainer } from "../../../../atoms"

export const MainContainer = styled(GridContainer)`
  height: 700px;
  width: 700px;
  @media (max-width: 768px) {
    width: 600px;
  }
  @media (max-width: 620px) {
    width: 450px;
  }
  @media (max-width: 500px) {
    width: 350px;
  }
`

export const ChartContainer = styled(FlexContainer)`
  height: 370px;
  width: 370px;
  transform: rotate(45deg);
  @media (max-width: 768px) {
    height: 325px;
    width: 325px;
  }
  @media (max-width: 620px) {
    height: 280px;
    width: 280px;
  }
  @media (max-width: 500px) {
    transform: translateY(40px) rotate(45deg);
    height: 220px;
    width: 220px;
  }
`

export const AxisContainerLeft = styled(FlexContainer)`
  top: 220px;
  transform: rotate(-90deg);
  width: 50px;
  @media (max-width: 768px) {
    top: 200px;
  }
  @media (max-width: 620px) {
    top: 175px;
  }
  @media (max-width: 500px) {
    top: 140px;
  }
`

export const AxisContainerRight = styled(FlexContainer)`
  left: 100%;
  @media (max-width: 500px) {
    left: 97%;
  }
`

export const AxisTextContainer = styled(FlexContainer)`
  font-size: ${themifyFontSize(1)};
  @media (max-width: 500px) {
    font-size: ${themifyFontSize(0)};
  }
`

export const AbsPosContainer = styled(GridContainer)`
  ${({ topBig, topSmall }) => css`
    top: ${topBig}px;
    @media (max-width: 500px) {
      top: ${topSmall}px;
    }
  `}
`

export const ExpContainerLeft = styled(GridContainer)`
  left: 40px;
  @media (max-width: 768px) {
    left: 25px;
  }
  @media (max-width: 500px) {
    left: 15px;
  }
`

export const ExpContainerRight = styled(GridContainer)`
  right: 40px;
  @media (max-width: 768px) {
    right: 25px;
  }
  @media (max-width: 500px) {
    right: 15px;
  }
`

export const HintContainer = styled(AbsPosContainer)`
  right: 40px;
  top: 165px;
  font-size: ${themifyFontSize(1)};
  @media (max-width: 768px) {
    right: 25px;
  }
  @media (max-width: 620px) {
    right: 0px;
    top: 145px;
  }
  @media (max-width: 500px) {
    font-size: ${themifyFontSize(0)};
    top: 195px;
  }
`
