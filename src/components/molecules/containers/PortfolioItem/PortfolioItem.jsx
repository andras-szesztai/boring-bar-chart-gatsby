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
import { space } from "../../../../themes/theme"

const DEVICE_ICONS = {
  desktop: { icon: FaDesktop, size: 20 },
  tablet: { icon: FaTabletAlt, size: 19 },
  mobile: { icon: FaMobileAlt, size: 19 },
}

const ImageContainer = styled(FlexContainer)`
  position: absolute;
  align-items: flex-start;
  pointer-events: none;
  border-radius: ${space[1]}px;
  height: 20rem;
  overflow: hidden;

  @media (min-width: 700px) {
    height: 22rem;
  }

  @media (min-width: 1300px) {
    height: 25rem;
  }
`

const TextContainer = styled(GridContainer)`
  transition: all ${themifyTransition("sm")};
  background-color: transparent;
  color: transparent;
  border-radius: ${space[1]}px;
  height: 20rem;
  overflow: hidden;
  :hover {
    background-color: rgba(51, 51, 51, 0.95);
    color: #fff;
  }

  @media (min-width: 700px) {
    height: 22rem;
  }

  @media (min-width: 1300px) {
    height: 25rem;
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
    <>
      {subWeeks(new Date(), 1) < new Date(updated ? updated : date) && (
        <Ribbon
          text={updated ? "UPDATED" : "NEW"}
          width={isMobileOnly ? 100 : undefined}
          top={isMobileOnly ? 10 : undefined}
          padding={isMobileOnly ? 5 : undefined}
        />
      )}
      <ImageContainer fullSize>
        <Image
          style={{ minWidth: "100%", overflow: "hidden" }}
          fluid={image.fluid}
        />
      </ImageContainer>
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
                return <Icon key={device} size={size} />
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
    </>
  )
}

export default withOrientationChange(PortfolioItem)
