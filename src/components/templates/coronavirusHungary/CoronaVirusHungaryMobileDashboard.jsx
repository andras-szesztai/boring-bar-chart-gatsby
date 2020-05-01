import React from "react"
import { useWindowSize } from "@react-hook/window-size"

import { useDeviceType } from "../../../hooks"
import { FlexContainer } from "../../atoms"

export default function Dashboard({ data, loading }) {
  const device = useDeviceType()

  const [width, height] = useWindowSize()

  return (
    <FlexContainer height="200px">
      {device} {width} {height}
    </FlexContainer>
  )
}
