import React, { useState } from "react"

import { GridContainer, FlexContainer, CheckBox } from "../../atoms"

const CarouselContainer = ({ children, pages }) => {
  const [activePage, setActivePage] = useState(0)
  const [hoveredOver, setHoveredOver] = useState(undefined)

  return (
    <GridContainer fullSize rows="1fr 20%" rowGap={0}>
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
            direction="column"
            pos="relative"
            onMouseEnter={() => setHoveredOver(i)}
            onMouseLeave={() => setHoveredOver(undefined)}
          >
            {hoveredOver === i && (
              <FlexContainer
                absPos
                bottom={20}
                textAlign="center"
                width="150px"
              >
                {pages[i]}
              </FlexContainer>
            )}
            {i === activePage ? (
              <CheckBox
                id={i}
                parentChecked
                checked={true}
                isRadio
                transitionDuration={0}
                width={12}
              />
            ) : (
              <CheckBox
                parentChecked
                checked={false}
                isRadio
                transitionDuration={0}
                width={12}
              />
            )}
          </FlexContainer>
        ))}
      </FlexContainer>
    </GridContainer>
  )
}

export default CarouselContainer
