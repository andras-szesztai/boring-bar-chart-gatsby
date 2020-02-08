import React, { useState } from "react"
import { GridContainer, FlexContainer, CheckBox } from "../../atoms"
import { IoIosRadioButtonOff, IoIosRadioButtonOn } from "react-icons/io"
import { colors } from "../../../themes/theme"

const { grayDarkest } = colors

const CarouselContainer = ({ children }) => {
  const [activePage, setActivePage] = useState(0)

  const iconProps = { fill: grayDarkest, size: 14 }

  return (
    <GridContainer fullSize rows="1fr 20%">
      <FlexContainer align="flex-start">
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
              <CheckBox
                parentChecked
                checked={true}
                isRadio
                transitionDuration={0}
                width={10}
              />
            ) : (
              <CheckBox
                parentChecked
                checked={false}
                isRadio
                transitionDuration={0}
                width={10}
              />
            )}
          </FlexContainer>
        ))}
      </FlexContainer>
    </GridContainer>
  )
}

export default CarouselContainer
