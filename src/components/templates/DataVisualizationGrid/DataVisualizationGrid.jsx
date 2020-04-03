import React from "react"
import { Link } from "gatsby"
import { isMobileOnly, withOrientationChange } from "react-device-detect"
import Image from "gatsby-image"
import styled from "styled-components"
import { subWeeks } from "date-fns"

import { FlexContainer, GridContainer, Ribbon } from "../../atoms"
import {
  themifyTransition,
  themifySpace,
  themifyColor,
} from "../../../themes/mixins"

const MainGrid = styled(GridContainer)`
  padding: 4rem;
  overflow-y: auto;
  grid-row-gap: 1rem;

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, 2fr);
    padding: 6rem;
    grid-column-gap: 4rem;
    grid-row-gap: 2rem;
  }
  @media (min-width: 1300px) {
    padding: 8rem;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 6rem;
    grid-row-gap: 3rem;
  }
`

const ItemContainer = styled(FlexContainer)`
  overflow: hidden;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
`

const TextContainer = styled(GridContainer)`
  transition: all ${themifyTransition("sm")};
  background-color: transparent;
  color: transparent;
  :hover {
    background-color: rgba(51, 51, 51, 0.95);
    color: #fff;
  }
`

const SingleText = styled(FlexContainer)`
  transition: all ${themifyTransition("sm")};
  color: transparent;

  ${TextContainer}:hover & {
    color: #fff;
  }
`

const LinkContainer = styled(FlexContainer)`
  transition: all ${themifyTransition("sm")};
  background-color: transparent;
  padding: ${themifySpace(1)}px ${themifySpace(2)}px;
  border-radius: ${themifySpace(1)}px;
  a {
    color: transparent;
    text-decoration: none;
  }
  ${TextContainer}:hover & {
    background-color: #fff;
    a {
      color: ${themifyColor("grayDarkest")};
    }
  }
`

function DataVisualizationGrid({ isPortrait, list }) {
  const isSmallScreen = isPortrait && isMobileOnly
  return (
    <MainGrid>
      {list.map(
        ({
          node: { id, title, link, isOutside, image, description, date },
        }) => (
          <ItemContainer
            pos="relative"
            key={id}
            height={isSmallScreen ? "150px" : "180px"}
            borderRadius={1}
          >
            {subWeeks(new Date(), 2) < new Date(date) && <Ribbon text="NEW" />}
            <FlexContainer pos="relative" fullSize align="flex-start">
              <Image style={{ minWidth: "100%" }} fluid={image.fluid} />
            </FlexContainer>
            <TextContainer
              absPos
              fullSize
              rows="min-content 1fr min-content"
              paddingLeft={isSmallScreen ? 2 : 3}
              paddingRight={isSmallScreen ? 2 : 3}
              paddingTop={2}
              paddingBottom={isSmallScreen ? 2 : 3}
              rowGap={isSmallScreen ? 1 : 2}
            >
              <SingleText
                justify="flex-start"
                fontWeight="medium"
                fontSize={isSmallScreen ? 2 : 3}
                lineHeight={1.25}
              >
                {title}
              </SingleText>
              <SingleText justify="flex-start" align="flex-start">
                {description}
              </SingleText>
              <SingleText justify="flex-end">
                <LinkContainer fontWeight="medium" cursor="pointer">
                  {!isOutside ? (
                    <Link to={`${link}`}>Find out more</Link>
                  ) : (
                    <a
                      href={`${link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Find out more
                    </a>
                  )}
                </LinkContainer>
              </SingleText>
            </TextContainer>
          </ItemContainer>
        )
      )}
    </MainGrid>
  )
}

export default withOrientationChange(DataVisualizationGrid)
