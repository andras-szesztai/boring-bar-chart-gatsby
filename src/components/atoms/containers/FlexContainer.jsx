import styled from "styled-components"
import Container from "./Container"

const FlexContainer = styled(Container)`

  display: flex;
  justify-content: ${({ justify }) => justify};
  align-items: ${({ align }) => align};
  flex-direction: ${({ direction }) => direction};
  
`

export default FlexContainer
