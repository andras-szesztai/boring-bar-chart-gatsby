import React, { useState } from "react"
import { GridContainer, FlexContainer } from "../../atoms"
import { IoIosRadioButtonOff, IoIosRadioButtonOn } from "react-icons/io"
import { colors } from "../../../themes/theme"

const { grayDarkest } = colors

const CarouselContainer = ({ children }) => {
  const [activePage, setActivePage] = useState(0)

  const iconProps = { fill: grayDarkest, size: 14 }

  return (
    <GridContainer fullSize rows="1fr 20%">
      <FlexContainer>
        {children.filter((el, i) => i === activePage)}
      </FlexContainer>
      <FlexContainer fullSize>
        {children.map((el, i) => (
          <FlexContainer
            key={i}
            cursor="pointer"
            marginLeft={1}
            marginRight={1}
            onClick={() => setActivePage(i)}
          >
            {i === activePage ? (
              <IoIosRadioButtonOn {...iconProps} />
            ) : (
              <IoIosRadioButtonOff {...iconProps} />
            )}
          </FlexContainer>
        ))}
      </FlexContainer>
    </GridContainer>
  )
}

export default CarouselContainer
