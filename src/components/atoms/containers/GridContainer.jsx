import styled, { css } from "styled-components"
import Container from "./Container"

const GridContainer = styled(Container)`
  display: grid;
  ${({ columns, rows, areas, rowGap }) => css`
    grid-template-columns: ${columns};
    grid-template-rows: ${rows};
    grid-template-areas:${areas};
    grid-row-gap: ${rowGap}rem;
  `}
`

GridContainer.defaultProps = {
  rowGap: 1
}

export default GridContainer
