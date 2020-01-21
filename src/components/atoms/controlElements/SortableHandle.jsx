import React from "react"
import { SortableHandle } from "react-sortable-hoc"
import { IoIosMove, IoIosResize } from "react-icons/io"
import styled, { css } from "styled-components"

import { FlexContainer } from "../containers"
import { colors } from "../../../themes/theme"

const { grayDark } = colors

const Container = styled(FlexContainer)`
  pointer-events: auto !important;
  cursor: col-resize;

  ${({ horizontal }) =>
    horizontal &&
    css`
      svg {
        transform: rotate(45deg);
      }
    `}
`

export default SortableHandle(
  ({ size = 20, fill = grayDark, horizontal, allDims, align }) => (
    <Container fill={fill} horizontal={horizontal} fullSize align={align}>
      {!!allDims && <IoIosMove size={size} />}
      {!!horizontal && <IoIosResize size={size} />}
    </Container>
  )
)
