import styled, { css } from "styled-components"

import { GridContainer, FlexContainer } from "../../../atoms"
import { themifySpace, themifyColor } from "../../../../themes/mixins"
import { transition } from "../../../../themes/theme"

const MainGrid = styled(GridContainer)`
  grid-column-gap: 4rem;
  grid-row-gap: 2rem;
  @media (min-width: 450px) {
    height: 95%;
    width: 95%;
    grid-template-columns: 1fr;
    grid-template-rows: 20fr 20fr;
  }

  @media (min-width: 750px) {
    height: 95%;
    width: 96%;
    grid-template-columns: 30fr 70fr;
    grid-template-rows: 1fr;
  }

  @media (min-width: 1000px) {
    height: 95%;
    width: 96%;
    grid-template-columns: 32.5fr 67.5fr;
  }

  @media (min-width: 1400px) {
    height: 92.5%;
    width: 95%;
    grid-template-columns: 35fr 65fr;
  }

  @media only screen and (max-device-width: 1366px) and (orientation: landscape) {
    height: 95%;
    width: 96%;
    grid-template-columns: 35fr 65fr;
  }
  @media only screen and (max-device-width: 1024px) and (orientation: portrait) {
    height: 96%;
    width: 95%;
    grid-template-rows: 4fr 6fr;
    grid-template-columns: 1fr;
  }

  @media only screen and (max-device-width: 820px) and (orientation: landscape) {
    height: 95%;
    width: 97.5%;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
  @media only screen and (max-device-width: 480px) and (orientation: portrait) {
    height: 97.5%;
    width: 95%;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
`

const smallScreenAreas = css`
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 20fr 80fr;
  grid-template-areas:
    "title title"
    "chartOne chartTwo";
`

const bigScreenAreas = css`
  grid-template-columns: 1fr;
  grid-template-rows: 16fr 42fr 42fr;
  grid-template-areas:
    "title"
    "chartOne"
    "chartTwo";
`

const MainChartsContainer = styled(GridContainer)`
  grid-column-gap: ${themifySpace(5)}px;
  @media (min-width: 450px) {
    ${smallScreenAreas}
  }

  @media (min-width: 750px) {
    ${bigScreenAreas}
  }

  @media only screen and (max-device-width: 1366px) and (orientation: landscape) {
    ${bigScreenAreas}
  }
  @media only screen and (max-device-width: 1024px) and (orientation: portrait) {
    ${smallScreenAreas}
  }

  @media only screen and (max-device-width: 820px) and (orientation: landscape) {
    ${smallScreenAreas}
  }
  @media only screen and (max-device-width: 480px) and (orientation: portrait) {
    ${bigScreenAreas}
  }
`

const IconContainer = styled(FlexContainer)`
  svg {
    transition: fill ${transition.md};
    fill: ${({ color }) => themifyColor(color || "grayLightest")};
  }

  :hover {
    svg {
      fill: ${({ color }) => themifyColor(color || "grayDarkest")};
    }
  }
`

export const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
}

const styledComponents = {
  MainGrid,
  MainChartsContainer,
  IconContainer,
}

export default styledComponents
