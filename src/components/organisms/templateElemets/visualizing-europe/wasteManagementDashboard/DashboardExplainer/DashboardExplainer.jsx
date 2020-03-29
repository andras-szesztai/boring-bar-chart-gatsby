import React from "react"
import Modal from "react-modal"
import { MobileView, BrowserView } from "react-device-detect"
import ReactTooltip from "react-tooltip"
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

Modal.setAppElement("#___gatsby")

export default function DashboardExplainer() {
  const [modalIsOpen, setIsOpen] = React.useState(false)

  return (
    <FlexContainer gridArea="helper">
      <MobileView>
        <FlexContainer>
          <Modal
            isOpen={modalIsOpen}
            style={customStyles}
            onRequestClose={() => setIsOpen(false)}
            contentLabel="Example Modal"
          >
            <InformationContainer color={colors.grayDarkest} />
          </Modal>
          <IconContainer color="grayDarkest" onClick={() => setIsOpen(true)}>
            <IoMdInformationCircle size={20} />
          </IconContainer>
        </FlexContainer>
      </MobileView>
      <BrowserView>
        <FlexContainer>
          <ReactTooltip
            effect="solid"
            place="bottom"
            clickable
            multiline
            id="tooltip"
            getContent={() => <InformationContainer color="#fff" />}
          />
          <IconContainer data-for="tooltip" data-tip="">
            <IoMdInformationCircle size={25} />
          </IconContainer>
        </FlexContainer>
      </BrowserView>
    </FlexContainer>
  )
}
