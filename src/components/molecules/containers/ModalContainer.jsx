import React from "react"
import chroma from "chroma-js"

import { FlexContainer } from "../../atoms"
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
      <FlexContainer bgColor={colors.whiteDark} >

      </FlexContainer>
    </FlexContainer>
  )
}
