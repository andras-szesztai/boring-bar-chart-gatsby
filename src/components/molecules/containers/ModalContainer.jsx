import React, { useState, useEffect } from "react"
import chroma from "chroma-js"
import { IoIosClose } from "react-icons/io"

import { FlexContainer, CloseIconContainer } from "../../atoms"
import { colors } from "../../../themes/theme"
import { usePrevious } from "../../../hooks"

export default function ModalContainer({
  shouldToggle,
  width,
  height,
  children,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
}) {
  const prevShouldToggle = usePrevious(shouldToggle)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!prevShouldToggle && shouldToggle) {
      setIsOpen(prev => !prev)
    }
  }, [prevShouldToggle, shouldToggle])

  return (
    <FlexContainer
      fullScreen
      pos="fixed"
      top={0}
      left={0}
      bgColor={chroma(colors.grayDarkest).alpha(0.9)}
      zIndex="overlay"
      isHideable
      isVisible={isOpen}
      onClick={() => setIsOpen(false)}
    >
      <FlexContainer
        bgColor={colors.whiteDark}
        width={width}
        height={height}
        minWidth={minWidth}
        maxWidth={maxWidth}
        minHeight={minHeight}
        maxHeight={maxHeight}
        pos="relative"
        onClick={e => e.stopPropagation()}
      >
        <CloseIconContainer
          cursor="pointer"
          absPos
          top={4}
          right={4}
          onClick={() => setIsOpen(false)}
        >
          <IoIosClose className="icon" size={25} />
        </CloseIconContainer>
        {children}
      </FlexContainer>
    </FlexContainer>
  )
}

ModalContainer.defaultProps = {
  width: "80%",
  height: "80%",
  minHeight: "600px",
  maxHeight: "800px",
  minWidth: "1000px",
  maxWidth: "1400px",
}
