import styled, { css } from "styled-components"
import Container from "./Container"

const FlexContainer = styled(Container)`
  display: flex;
  ${({ justify, align, direction }) => css`
    justify-content: ${justify};
    align-items: ${align};
    flex-direction: ${direction};
  `}
  
`

export default FlexContainer
