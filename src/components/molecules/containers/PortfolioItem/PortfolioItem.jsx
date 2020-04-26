import React from "react"
import { Link } from "gatsby"
import { isMobileOnly, withOrientationChange } from "react-device-detect"
import Image from "gatsby-image"
import styled from "styled-components"
import { subWeeks } from "date-fns"
import { FaDesktop, FaTabletAlt, FaMobileAlt } from "react-icons/fa"

import { FlexContainer, GridContainer, Ribbon } from "../../../atoms"
import {
  themifyTransition,
  themifySpace,
  themifyColor,
} from "../../../../themes/mixins"

const DEVICE_ICONS = {
  desktop: { icon: FaDesktop, size: 20 },
  tablet: { icon: FaTabletAlt, size: 19 },
  mobile: { icon: FaMobileAlt, size: 19 },
}

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

function PortfolioItem({
  isPortrait,
  data: {
    id,
    title,
    link,
    isOutside,
    image,
    description,
    date,
    deviceTypes,
    updated,
  },
}) {
  const isSmallScreen = isPortrait && isMobileOnly
  const devices =
    deviceTypes &&
    Object.keys(deviceTypes[0])
      .filter(el => deviceTypes[0][el])
      .reverse()

  return (
    <ItemContainer
      pos="relative"
      key={id}
      height={isSmallScreen ? "160px" : "180px"}
      borderRadius={1}
    >
      {subWeeks(new Date(), 1) < new Date(updated ? updated : date) && (
        <Ribbon
          text={updated ? "UPDATED" : "NEW"}
          width={isMobileOnly ? 100 : undefined}
          top={isMobileOnly ? 10 : undefined}
          padding={isMobileOnly ? 5 : undefined}
        />
      )}
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
          textAlign="left"
          fontWeight="medium"
          fontSize={isSmallScreen ? 2 : 3}
          lineHeight={1.25}
        >
          {title}
        </SingleText>
        <SingleText textAlign="left" justify="flex-start" align="flex-start">
          {description}
        </SingleText>
        <SingleText justify="space-between">
          {}
          {Array.isArray(devices) && (
            <SingleText
              width={`${devices.length * 30}px`}
              justify="space-between"
            >
              {devices.map(device => {
                const { icon: Icon, size } = DEVICE_ICONS[device]
                return <Icon size={size} />
              })}
            </SingleText>
          )}
          <LinkContainer fontWeight="medium" cursor="pointer">
            {!isOutside ? (
              <Link to={`${link}`}>Find out more</Link>
            ) : (
              <a href={`${link}`} target="_blank" rel="noopener noreferrer">
                Find out more
              </a>
            )}
          </LinkContainer>
        </SingleText>
      </TextContainer>
    </ItemContainer>
  )
}

export default withOrientationChange(PortfolioItem)
