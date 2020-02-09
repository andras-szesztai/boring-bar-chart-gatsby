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
            marginLeft={1}
            marginRight={1}
            onClick={() => setActivePage(i)}
            direction="column"
            pos="relative"
            onMouseEnter={() => i !== activePage && setHoveredOver(i)}
            onMouseLeave={() => i !== activePage && setHoveredOver(undefined)}
          >
            {hoveredOver === i && i !== activePage && (
              <FlexContainer
                absPos
                bottom={16}
                textAlign="center"
                width="150px"
                fontSize={1}
                fontWeight={3}
              >
                {pages[i]}
              </FlexContainer>
            )}
            {i === activePage ? (
              <CheckBox
                id={i}
                cursor={i === activePage && "auto"}
                parentChecked
                checked={true}
                isRadio
                transitionDuration="xs"
                width={10}
              />
            ) : (
              <CheckBox
                parentChecked
                cursor={i === activePage && "auto"}
                checked={false}
                isRadio
                transitionDuration="xs"
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
