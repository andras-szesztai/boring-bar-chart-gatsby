import styled, { css } from "styled-components"
import { fontSize } from "../../../themes/theme"

const ChartWrapper = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  max-height: 100%;
  height: 100%;
  max-width: 100%;
  width: 100%;

  ${({ withBorder }) =>
    withBorder &&
    css`
      border: 1px solid black;
    `}
  text {
    font-size: ${fontSize[0]};
  }
`

export default ChartWrapper
