import React from "react"
import Modal from "react-modal"
import { isMobile } from "react-device-detect"
import styled from "styled-components"
import { IoMdInformationCircle } from "react-icons/io"

import { FlexContainer } from "../../../../../atoms"
import { CreditsContainer } from "../../../../../molecules"
import { CREDIT_ELEMENTS } from "../../../../../../constants/visualizing-europe/wasteManagement"
import { colors, transition } from "../../../../../../themes/theme"
import { themifyColor } from "../../../../../../themes/mixins"

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

const IconContainer = styled(FlexContainer)`
  padding-top: 1rem;
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

Modal.setAppElement("#___gatsby")

export default function DashboardExplainer({ modalIsOpen, setIsOpen }) {
  return (
    <FlexContainer gridArea="helper" cursor="pointer">
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Example Modal"
      >
        <FlexContainer direction="column">
          <FlexContainer
            fontColor={colors.grayDarkest}
            width="180px"
            marginBottom={3}
            bgColor="transparent"
          >
            Chart comment: Per Capita Municipal Waste is represented as a single
            area chart, while Material Recycling and Composting are areas
            stacked one upon the other.
          </FlexContainer>
          <CreditsContainer
            direction="column"
            elements={CREDIT_ELEMENTS}
            absPos={false}
            color={colors.grayDarkest}
            linkColor={colors.grayDarkest}
          />
        </FlexContainer>
      </Modal>
      <IconContainer
        color={isMobile && "grayDarkest"}
        onClick={() => setIsOpen(true)}
      >
        <IoMdInformationCircle size={isMobile ? 20 : 25} />
      </IconContainer>
    </FlexContainer>
  )
}
