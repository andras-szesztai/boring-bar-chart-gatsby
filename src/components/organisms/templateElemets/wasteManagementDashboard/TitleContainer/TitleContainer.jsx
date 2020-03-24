import React from "react"
import Switch from "react-switch"
import { IoMdInformationCircle } from "react-icons/io"
import ReactTooltip from "react-tooltip"

import { GridContainer, Title, FlexContainer } from "../../../../atoms"
import { colors } from "../../../../../themes/theme"
import { CreditsContainer } from "../../../../molecules"
import { CREDIT_ELEMENTS } from "../../../../../constants/visualizing-europe/wasteManagement"

export default function TitleContainer({ metric, setMetric }) {
  return (
    <GridContainer columnGap={2} columns="4fr 6fr" gridArea="title">
      <ReactTooltip
        effect="solid"
        place="bottom"
        clickable
        id="test"
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
      <FlexContainer>
        <Title fontSize={3} fontWeight="medium">
          State of Waste Management in Europe
        </Title>
      </FlexContainer>
      <FlexContainer direction="column" justify="space-evenly">
        <FlexContainer data-for="test" data-tip="">
          <IoMdInformationCircle
            size={25}
            fill={colors.grayDarkest}
            cursor="pointer"
          />
        </FlexContainer>
        <GridContainer rows="repeat(2, min-content)">
          <FlexContainer>Per capita metric</FlexContainer>
          <FlexContainer>
            <Title marginBottom={1} textAlign="right" marginRight={1}>
              Kg
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
        </GridContainer>
      </FlexContainer>
    </GridContainer>
  )
}
