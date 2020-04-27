import React, { useState, useEffect } from "react"
import { FlexContainer } from "../../../atoms"

import { useScrollPosition, useWindowDimensions } from "../../../../hooks"
import { FaArrowAltCircleDown } from "react-icons/fa"
import { colors } from "../../../../themes/theme"

export default function ScrollHint({ color, opacity, size }) {
  const scrollPosition = useScrollPosition()
  const [isScrolled, setIsScrolled] = useState(false)
  const { windowHeight, windowWidth } = useWindowDimensions()

  useEffect(() => {
    if (!isScrolled && !!scrollPosition) {
      setIsScrolled(true)
    }
  }, [isScrolled, scrollPosition])

  return windowHeight && !isScrolled ? (
    <FlexContainer
      absPos
      top={windowHeight - size * 1.5}
      left={windowWidth / 2 - size / 2}
      zIndex="tooltip"
    >
      <FaArrowAltCircleDown color={color} style={{ opacity }} size={size} />
    </FlexContainer>
  ) : (
    <></>
  )
}

ScrollHint.defaultProps = {
  color: colors.grayDarkest,
  opacity: 1,
}
