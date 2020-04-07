import React from "react"
import styled, { css } from "styled-components"
import { themifyFontSize } from "../../../../themes/mixins"

const ChartWrapper = styled.div`
  position: relative;

  text,
  .tick text {
    font-family: gill-sans-nova, sans-serif !important;
  }

  display: flex;
  justify-content: center;
  align-items: center;

  max-height: 100%;
  height: 100%;
  max-width: 100%;
  width: 100%;

  .ref-line,
  .ref-group {
    pointer-events: none;
  }

  .ref-line {
    stroke-dasharray: 4, 1;
  }

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

export default function(props) {
  const { areaRef } = props
  return <ChartWrapper ref={areaRef} {...props} />
}

ChartWrapper.defaultProps = {
  fontSize: 1,
}
