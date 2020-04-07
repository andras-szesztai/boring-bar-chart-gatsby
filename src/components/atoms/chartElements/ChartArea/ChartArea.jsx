import React from "react"
import styled from "styled-components"

export const ChartArea = styled.g`
  transform: translate(
    ${props => props.marginLeft || 0}px,
    ${props => props.marginTop || 0}px
  );
`

export default function(props) {
  const { areaRef, marginLeft, marginTop } = props
  return (
    <ChartArea
      ref={areaRef}
      marginLeft={marginLeft}
      marginTop={marginTop}
      {...props}
    />
  )
}
