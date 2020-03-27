import React from "react"
import Switch from "react-switch"
import { IoMdInformationCircle } from "react-icons/io"
import ReactTooltip from "react-tooltip"
import styled from "styled-components"
import { isBrowser, isMobile } from "react-device-detect"

import { GridContainer, Title, FlexContainer } from "../../../../atoms"
import { colors, transition } from "../../../../../themes/theme"
import { CreditsContainer } from "../../../../molecules"
import { CREDIT_ELEMENTS } from "../../../../../constants/visualizing-europe/wasteManagement"
import { themifyColor } from "../../../../../themes/mixins"

import Modal from "react-modal"

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
}

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

function InformationContainer(props) {
  return (
    <FlexContainer direction="column">
      <FlexContainer
        fontColor={props.color}
        width="180px"
        marginBottom={3}
        bgColor="transparent"
      >
        Chart comment: Per Capita Municipal Waste is represented as a single
        area chart, while Material Recycling and Composting are areas stacked
        one upon the other.
      </FlexContainer>
      <CreditsContainer
        direction="column"
        elements={CREDIT_ELEMENTS}
        absPos={false}
        color={props.color}
        linkColor={props.color}
      />
    </FlexContainer>
  )
}

export default function TitleContainer({ metric, setMetric, isSmallScreen }) {
  const [modalIsOpen, setIsOpen] = React.useState(false)
  return (
    <>
      {isMobile && (
        <Modal
          isOpen={modalIsOpen}
          style={customStyles}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="Example Modal"
        >
          <InformationContainer color={colors.grayDarkest} />
        </Modal>
      )}
      <ReactTooltip
        effect="solid"
        place="bottom"
        clickable
        multiline
        id="tooltip"
        getContent={() => <InformationContainer color="#fff" />}
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
          <IconContainer
            data-for="tooltip"
            data-tip=""
            onClick={() => isMobile && setIsOpen(true)}
          >
            <IoMdInformationCircle size={isSmallScreen ? 20 : 25} />
          </IconContainer>
        </GridContainer>
        <FlexContainer justify={isSmallScreen ? "center" : "flex-start"}>
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
              width={36}
            />
            <Title marginLeft={1}>%</Title>
          </FlexContainer>
        </FlexContainer>
      </GridContainer>
    </>
  )
}
