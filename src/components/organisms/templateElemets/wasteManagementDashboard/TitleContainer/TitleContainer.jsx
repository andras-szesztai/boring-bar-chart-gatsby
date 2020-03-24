import React from "react"
import Switch from "react-switch"
import { IoMdInformationCircle } from "react-icons/io"
import ReactTooltip from "react-tooltip"
import styled from "styled-components"

import { GridContainer, Title, FlexContainer } from "../../../../atoms"
import { colors, transition } from "../../../../../themes/theme"
import { CreditsContainer } from "../../../../molecules"
import { CREDIT_ELEMENTS } from "../../../../../constants/visualizing-europe/wasteManagement"
import { themifyColor } from "../../../../../themes/mixins"

const IconContainer = styled(FlexContainer)`
  svg {
    transition: fill ${transition.md};
    fill: ${themifyColor("grayLightest")};
  }

  :hover {
    svg {
      fill: ${themifyColor("grayDarkest")};
    }
  }
`

export default function TitleContainer({ metric, setMetric, isSmallScreen }) {
  return (
    <>
      <ReactTooltip
        effect="solid"
        place="bottom"
        clickable
        id="tooltip"
        getContent={() => {
          return (
            <CreditsContainer
              direction="column"
              elements={CREDIT_ELEMENTS}
              absPos={false}
              color="#fff"
              linkColor="#fff"
            />
          )
        }}
      />
      <GridContainer
        columnGap={2}
        rows={isSmallScreen ? "2fr 1fr" : "min-content 1fr"}
        gridArea="title"
      >
        <GridContainer
          rows={isSmallScreen && "1fr 1fr"}
          columns={!isSmallScreen && "2fr 1fr"}
        >
          <FlexContainer
            justify={isSmallScreen ? "center" : "flex-start"}
            fullSize
          >
            <Title fontSize={3} fontWeight="medium">
              State of Waste in Europe
            </Title>
          </FlexContainer>
          <IconContainer data-for="tooltip" data-tip="">
            <IoMdInformationCircle size={isSmallScreen ? 20 : 25} />
          </IconContainer>
        </GridContainer>
        <FlexContainer>
          <FlexContainer>
            <Title marginBottom={1} textAlign="right" marginRight={1}>
              Per capita metric: Kg
            </Title>
            <Switch
              checked={metric === "perc"}
              onChange={() =>
                setMetric(prev => (prev === "abs" ? "perc" : "abs"))
              }
              uncheckedIcon={false}
              checkedIcon={false}
              offColor={colors.grayLightest}
              onColor={colors.grayLightest}
              height={18}
              width={40}
            />
            <Title marginLeft={1}>%</Title>
          </FlexContainer>
        </FlexContainer>
      </GridContainer>
    </>
  )
}
