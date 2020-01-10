import styled, { css } from "styled-components"
import Container from "./Container"

const GridContainer = styled(Container)`
  display: grid;
  ${({ columns, rows, areas }) => css`
    grid-template-columns: ${columns};
    grid-template-rows: ${rows};
    grid-template-areas:${areas};
  `}
`

export default GridContainer
