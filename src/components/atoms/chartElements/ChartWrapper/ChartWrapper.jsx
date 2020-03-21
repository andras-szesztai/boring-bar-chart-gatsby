import styled, { css } from "styled-components"
import { themifyFontSize } from "../../../../themes/mixins"

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
  ${({ fontSize }) => css`
    text {
      font-size: ${themifyFontSize(fontSize)};
    }
  `}
`
ChartWrapper.defaultProps = {
  fontSize: 1
}

export default ChartWrapper
