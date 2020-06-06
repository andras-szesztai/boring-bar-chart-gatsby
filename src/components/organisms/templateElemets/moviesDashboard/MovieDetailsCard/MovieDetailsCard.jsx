import React from "react"

import {
  MovieDetailsCardRight,
  MovieDetailsCardLeft,
  CloseIconContainerLeft,
  CloseIconContainerRight,
  makeLeftVariants,
  makeRightVariants,
  IconsContainerRight,
  IconsContainerLeft
} from "./styles"
import CardContent from "./CardContent/CardContent"
import { makeCardProps } from "./utils"


export default function MovieDetailsCardComponent(props) {
  const delay = typeof props.prevActiveMovie.position == "number" ? 0.5 : 0

  return (
    <>
      <CardContent
        {...props}
        positionCheck={0}
        card={MovieDetailsCardRight}
        closeIconContainer={CloseIconContainerRight}
        iconsContainer={IconsContainerRight}
        cardAnimationProps={makeCardProps(makeRightVariants(delay))}
        justifyLink="flex-end"
      />
      <CardContent
        {...props}
        positionCheck={1}
        card={MovieDetailsCardLeft}
        closeIconContainer={CloseIconContainerLeft}
        iconsContainer={IconsContainerLeft}
        cardAnimationProps={makeCardProps(makeLeftVariants(delay))}
        justifyLink="flex-start"
      />
    </>
  )
}
