import styled from "styled-components"
import { motion } from "framer-motion"

import {
  COLORS,
} from "../../../../../../constants/moviesDashboard"
import { space } from "../../../../../../themes/theme"
import { TitleContainer, TextContainer } from "../../styles/styles"
import { themifyFontSize } from "../../../../../../themes/mixins"

export const ContentGrid = styled(motion.div)`
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0px;
  padding: ${space[3]}px;

  display: grid;
  grid-template-columns: 1fr 120px;
  grid-column-gap: ${space[3]}px;
  grid-template-rows: 185px repeat(3, 70px) 1fr;
  grid-row-gap: ${space[2]}px;
  grid-template-areas:
    "info poster"
    "genre genre"
    "crew crew"
    "cast cast"
    "link link";
`

export const MainInfoContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(2, min-content) 1fr;
  grid-area: info;
  align-items: start;
  position: relative;
`

export const MovieTitle = styled(TitleContainer)`
  color: ${COLORS.secondaryDark};
  line-height: 1.3;
  font-size: ${themifyFontSize(2)};
  cursor: default;
`

export const SubTitle = styled(TitleContainer)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${themifyFontSize(1)};
  font-weight: 300;
  color: ${COLORS.textColor};
  cursor: pointer;
  margin-top: 2px;
  cursor: default;
`

export const Overview = styled(TextContainer)`
  margin-top: 0px;
  width: 100%;
  position: absolute;
  bottom: 0px;
`

export const ContentItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const LinkContainer = styled.div`
  display: flex;

  align-items: center;
  grid-area: link;

  font-size: ${themifyFontSize(1)};
  color: ${COLORS.textColor};

  a {
    text-decoration: none;
    color: inherit;

    span {
      font-weight: 500;
    }
  }
`

export const Row = styled.div`
  display: grid;
  grid-template-rows: 30px 1fr;
  font-size: ${themifyFontSize(1)};
`

export const RowTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: ${COLORS.textColor};
  font-weight: 500;
`