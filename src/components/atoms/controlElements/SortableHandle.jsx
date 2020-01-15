import React from "react"
import { SortableHandle } from "react-sortable-hoc"
import { IoIosMove } from "react-icons/io"
import styled from 'styled-components'

import { FlexContainer } from "../containers"

const Container = styled(FlexContainer)`
  svg {
    cursor: pointer;
  }
`

export default SortableHandle(({
  size, color
}) => (
  <Container>
    <IoIosMove
      size={size}
      color={color}
    />
  </Container>
))
