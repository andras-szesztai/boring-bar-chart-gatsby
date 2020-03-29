import React from "react"
import Switch from "react-switch"
import { IoMdInformationCircle } from "react-icons/io"
import ReactTooltip from "react-tooltip"
import {
  MobileView,
  BrowserView,
  withOrientationChange,
  isMobile,
  isMobileOnly,
  isTablet,
  isBrowser
} from "react-device-detect"
import Modal from "react-modal"

import { GridContainer, Title, FlexContainer } from "../../../../atoms"
import { colors } from "../../../../../themes/theme"
import { CreditsContainer } from "../../../../molecules"
import { CREDIT_ELEMENTS } from "../../../../../constants/visualizing-europe/wasteManagement"
import styledComponents, { customStyles } from "../StyledComponents"
const { IconContainer } = styledComponents

Modal.setAppElement("#___gatsby")


function TitleContainer({
  metric,
  setMetric,
  isSmallScreen,
  isLandscape,
  isPortrait,
}) {
  const [modalIsOpen, setIsOpen] = React.useState(false)
  console.log("isLandscape", isLandscape)
  console.log("isPortrait", isPortrait)

  return (
    <>
      {/* <GridContainer
        columnGap={2}
        rows={isSmallScreen ? "2fr 1fr" : "min-content 1fr"}
        gridArea="title"
        id="main-grid"
      >
        <MobileView>
          <Modal
            isOpen={modalIsOpen}
            style={customStyles}
            onRequestClose={() => setIsOpen(false)}
            contentLabel="Example Modal"
          >
            <InformationContainer color={colors.grayDarkest} />
          </Modal>
        </MobileView>
        <BrowserView>
          <ReactTooltip
            effect="solid"
            place="bottom"
            clickable
            multiline
            id="tooltip"
            getContent={() => <InformationContainer color="#fff" />}
          />
        </BrowserView>

        <MobileView>
          <GridContainer
            rows={isSmallScreen && "1fr 1fr"}
            columns={!isSmallScreen && "2fr 1fr"}
          >
            <FlexContainer
              justify={isSmallScreen}
              fullSize
            >
              <Title fontSize={3} fontWeight="medium">
                State of Waste in Europe
              </Title>
            </FlexContainer>
            <FlexContainer>
             
          </GridContainer>
        </MobileView>

        <BrowserView>
          <GridContainer
            rows={isSmallScreen && "1fr 1fr"}
            columns={!isSmallScreen && "2fr 1fr"}

            // TODO: setup areas
          >
            <FlexContainer>
              <Title fontSize={3} fontWeight="medium">
                State of Waste in Europe
              </Title>
            </FlexContainer>
            <FlexContainer>
              <IconContainer data-for="tooltip" data-tip="">
                <IoMdInformationCircle size={25} />
              </IconContainer>
            </FlexContainer>
          </GridContainer>
        </BrowserView>

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
      </GridContainer> */}
    </>
  )
}

export default withOrientationChange(TitleContainer)
