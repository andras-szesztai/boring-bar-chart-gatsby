import styled from "styled-components"

export const ChartArea = styled.g`
  transform: translate(
    ${props => props.marginLeft || 0}px,
    ${props => props.marginTop || 0}px
  );
`

export default ChartArea
