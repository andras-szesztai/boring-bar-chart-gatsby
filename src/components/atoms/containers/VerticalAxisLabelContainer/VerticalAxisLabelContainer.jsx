import React from "react"
import styled from "styled-components"
import { themifyFontSize } from "../../../../themes/mixins"

const LabelContainer = styled.div`
  padding: 5px 10px;
  font-size: ${themifyFontSize(2)};
  color: ${({ color }) => color};
`

export default function(props) {
  return <LabelContainer {...props}>{props.label}</LabelContainer>
}
