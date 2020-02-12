import React from "react"
import chroma from "chroma-js"
import { IoIosClose } from "react-icons/io"

import { FlexContainer, CloseIconContainer } from "../../atoms"
import { colors } from "../../../themes/theme"

export default function ModalContainer({}) {
  return (
    <FlexContainer
      fullScreen
      pos="fixed"
      top={0}
      left={0}
      bgColor={chroma(colors.grayDarkest).alpha(0.75)}
      zIndex="overlay"
    >
      <FlexContainer bgColor={colors.whiteDark} width="80%" height="80%" pos="relative">
        <CloseIconContainer
          cursor="pointer"
          absPos
          top={4}
          right={4}
          onClick={() => {}}
        >
          <IoIosClose className="icon" size={25} />
        </CloseIconContainer>
      </FlexContainer>
    </FlexContainer>
  )
}
